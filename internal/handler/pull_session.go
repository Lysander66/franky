package handler

import (
	"fmt"
	"log/slog"
	"net/url"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/schollz/progressbar/v3"

	"github.com/Lysander66/ace/pkg/common/cnet"
	"github.com/Lysander66/ace/pkg/hls"
	"github.com/Lysander66/ace/pkg/playlist"
)

type PullSession struct {
	URI         string
	dir         string
	name        string
	numParallel int
	httpClient  *cnet.Client
	playlistURL *url.URL
}

func NewPullSession(uri, dir string, hc *cnet.Client) *PullSession {
	c := &PullSession{
		URI:         uri,
		dir:         dir,
		numParallel: 1,
		httpClient:  hc,
	}
	return c
}

func (c *PullSession) SetParallel(n int) {
	c.numParallel = n
}

func (c *PullSession) SetName(name string) {
	c.name = name
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

	var wg sync.WaitGroup
	limiter := make(chan struct{}, c.numParallel)
	bar := NewProgressBar(len(initialPlaylist.Segments), c.name+" 下载中")
	for i, seg := range initialPlaylist.Segments {
		wg.Add(1)
		limiter <- struct{}{}

		u, err := hls.ClientAbsoluteURL(c.playlistURL, seg.URI)
		if err != nil {
			slog.Error("downloadSegment", "err", err, "URI", seg.URI)
			continue
		}
		//name := u.Path
		//if index := strings.LastIndex(u.Path, "/"); index != -1 {
		//	name = u.Path[index:]
		//}
		//filename := fmt.Sprintf("%s/%s", c.dir, name)
		filename := fmt.Sprintf("%s/%d.ts", c.dir, i+1)

		go func(i int, rawURL string) {
			defer func() {
				wg.Done()
				<-limiter
			}()
			if err = c.downloadTs(rawURL, filename); err == nil {
				bar.Add(1)
			}
		}(i, u.String())

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

func NewProgressBar(max int, description string) *progressbar.ProgressBar {
	return progressbar.NewOptions(
		max,
		progressbar.OptionSetDescription(description),
		progressbar.OptionSetWriter(os.Stderr),
		progressbar.OptionSetWidth(10),
		progressbar.OptionThrottle(65*time.Millisecond),
		progressbar.OptionShowCount(),
		progressbar.OptionOnCompletion(func() {
			fmt.Fprint(os.Stderr, "\n")
		}),
		progressbar.OptionSpinnerType(14),
		progressbar.OptionFullWidth(),
		progressbar.OptionSetRenderBlankState(true),
		progressbar.OptionSetTheme(progressbar.Theme{
			Saucer:        "=",
			SaucerHead:    ">",
			SaucerPadding: " ",
			BarStart:      "[",
			BarEnd:        "]",
		}),
	)
}
