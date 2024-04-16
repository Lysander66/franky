package handler

import (
	"fmt"
	"log/slog"
	"net/url"
	"os"
	"path/filepath"
	"sync"
	"sync/atomic"
	"time"

	"github.com/Lysander66/ace/pkg/common/cnet"
	"github.com/Lysander66/ace/pkg/hls"
	"github.com/Lysander66/ace/pkg/playlist"
)

type Progress struct {
	N         int32 `json:"n"`
	Total     int   `json:"total"`
	Completed int   `json:"completed"`
}

type Option func(o *PullSession)

type PullSession struct {
	URI         string
	dir         string
	numParallel int
	httpClient  *cnet.Client
	playlistURL *url.URL
	progressCh  chan<- *Progress
}

func NewPullSession(uri, dir string, opts ...Option) *PullSession {
	c := &PullSession{
		URI:         uri,
		dir:         dir,
		numParallel: 1,
	}
	for _, opt := range opts {
		opt(c)
	}
	return c
}

func WithParallel(n int) Option {
	return func(o *PullSession) {
		if n > 0 {
			o.numParallel = n
		}
	}
}

func WithClient(hc *cnet.Client) Option {
	return func(o *PullSession) { o.httpClient = hc }
}

func WithProgress(ch chan<- *Progress) Option {
	return func(o *PullSession) { o.progressCh = ch }
}

func (c *PullSession) Start() error {
	var err error
	c.playlistURL, err = url.Parse(c.URI)
	if err != nil {
		return err
	}

	if c.httpClient == nil {
		c.httpClient = cnet.New()
	}

	return c.run()
}

func (c *PullSession) run() error {
	p, body, err := hls.FetchPlaylist(c.httpClient, c.playlistURL.String())
	if err != nil {
		slog.Error("FetchPlaylist", "err", err, "URI", c.URI)
		return err
	}

	var initialPlaylist *playlist.Media

	switch pl := p.(type) {
	case *playlist.Media: // Media Playlist
		initialPlaylist = pl
		c.downloadM3u8(body, filepath.Join(c.dir, filepath.Base(c.playlistURL.Path)))
	case *playlist.Multivariant: // Master Playlist
		leadingPlaylist := hls.PickLeadingPlaylist(pl.Variants)
		if leadingPlaylist == nil {
			return fmt.Errorf("no variants with supported codecs found")
		}

		u, err := hls.ClientAbsoluteURL(c.playlistURL, leadingPlaylist.URI)
		if err != nil {
			slog.Error("AbsoluteURL", "err", err, "URI", leadingPlaylist.URI)
			return err
		}

		pl2, body, err := hls.FetchMediaPlaylist(c.httpClient, u.String())
		if err != nil {
			slog.Error("FetchMediaPlaylist", "err", err, "URI", u.String())
			return err
		}

		initialPlaylist = pl2
		c.playlistURL = u
		c.downloadM3u8(body, filepath.Join(c.dir, filepath.Base(c.playlistURL.Path)))
	default:
		return fmt.Errorf("invalid playlist")
	}

	var n atomic.Int32
	var wg sync.WaitGroup
	limiter := make(chan struct{}, c.numParallel)
	total := len(initialPlaylist.Segments)
	for i, seg := range initialPlaylist.Segments {
		wg.Add(1)
		limiter <- struct{}{}

		u, err := hls.ClientAbsoluteURL(c.playlistURL, seg.URI)
		if err != nil {
			slog.Error("downloadSegment", "err", err, "URI", seg.URI)
			continue
		}
		filename := fmt.Sprintf("%s/%d.ts", c.dir, i+1)

		go func(rawURL, filename string) {
			defer func() {
				wg.Done()
				<-limiter
			}()
			if err = c.downloadTs(rawURL, filename); err == nil {
				if c.progressCh != nil {
					n.Add(1)
					c.progressCh <- &Progress{N: n.Load(), Total: total}
				}
			}
		}(u.String(), filename)

		// modify
		seg.URI = fmt.Sprintf("%d.ts", i+1)
	}
	wg.Wait()

	// save
	b, _ := initialPlaylist.Marshal()
	c.downloadM3u8(b, c.dir+"/index.m3u8")
	return nil
}

func (c *PullSession) downloadM3u8(data []byte, filename string) {
	err := os.WriteFile(filename, data, os.ModePerm)
	if err != nil {
		slog.Error("write m3u8", "err", err, "name", filename)
	}
}

func (c *PullSession) downloadTs(rawURL string, filename string) error {
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		//noop
	} else {
		slog.Debug("文件存在", "name", filename, "url", rawURL)
		return nil
	}

	// TODO
	time.Sleep(200 * time.Millisecond)

	data, err := hls.FetchSegment(c.httpClient, rawURL)
	if err != nil {
		slog.Error("FetchSegment", "err", err, "url", rawURL)
		return err
	}

	err = os.WriteFile(filename, data, os.ModePerm)
	if err != nil {
		slog.Error("write ts", "err", err, "name", filename, "url", rawURL)
		return err
	}
	slog.Debug("downloadTs", "name", filename, "url", rawURL)
	return nil
}
