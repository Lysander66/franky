package handler

import (
	"fmt"
	"testing"

	v1 "github.com/Lysander66/franky/api/v1"
	"github.com/schollz/progressbar/v3"
)

// go test -run TestDownloadHls
func TestDownloadHls(t *testing.T) {
	var (
		headers = map[string]string{
			"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
		}
		list = []string{
			"https://test-streams.mux.dev/x36xhzz/url_8/193039199_mp4_h264_aac_fhd_7.m3u8",
			"https://test-streams.mux.dev/x36xhzz/url_8/193039199_mp4_h264_aac_fhd_7.m3u8",
		}
	)

	for i, url := range list {
		req := &v1.DownloadReq{
			Url:         url,
			Name:        fmt.Sprintf("%d", i+1),
			NumParallel: 5,
			UseProxy:    1,
			Headers:     headers,
		}
		download(req)
	}
}

func download(req *v1.DownloadReq) {
	var bar *progressbar.ProgressBar
	progressCh := make(chan *Progress)

	go func() {
		DownloadHls(req, progressCh)
		close(progressCh)
	}()

	for {
		select {
		case progress, ok := <-progressCh:
			if !ok {
				return
			}
			if bar != nil {
				bar.Add(1)
			} else {
				bar = NewProgressBar(progress.Total, req.Name+" 下载中")
			}
		}
	}
}
