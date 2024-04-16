package handler

import (
	"fmt"
	"log/slog"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/Lysander66/ace/pkg/common/cnet"
	v1 "github.com/Lysander66/franky/api/v1"
	"github.com/schollz/progressbar/v3"
)

func DownloadHls(req *v1.DownloadReq, progressCh chan<- *Progress) {
	runtime.GOMAXPROCS(runtime.NumCPU())

	now := time.Now()
	if req.UseProxy == 1 {
		os.Setenv("http_proxy", "http://127.0.0.1:7890")
		os.Setenv("https_proxy", "http://127.0.0.1:7890")
		os.Setenv("all_proxy", "socks5://127.0.0.1:7890")
	} else {
		os.Unsetenv("http_proxy")
		os.Unsetenv("https_proxy")
		os.Unsetenv("all_proxy")
	}

	name := strings.TrimSpace(req.Name)
	if name == "" {
		name = now.Format("15点04分")
	}
	filename := name + ".mp4"

	homeDir, err := os.UserHomeDir()
	if err != nil {
		slog.Error("UserHomeDir", "err", err)
		return
	}
	tsDirectory := filepath.Join(homeDir, "ts", now.Format(time.DateOnly), name)
	if err = os.MkdirAll(tsDirectory, os.ModePerm); err != nil {
		slog.Error("Mkdir", "err", err, "tsDir", tsDirectory)
		return
	}

	directory := strings.TrimSpace(req.Directory)
	if directory == "" {
		directory = filepath.Join(homeDir, "Downloads", now.Format(time.DateOnly))
	}
	if err = os.MkdirAll(directory, os.ModePerm); err != nil {
		slog.Error("Mkdir", "err", err, "dir", directory)
		return
	}

	client := cnet.New()
	client.SetHeaders(req.Headers)
	pullSession := NewPullSession(
		req.Url,
		tsDirectory,
		WithParallel(req.NumParallel),
		WithClient(client),
		WithProgress(progressCh),
	)

	err = pullSession.Start()
	if err != nil {
		slog.Error("pull", "err", err, "url", req.Url)
		return
	}
	slog.Info("Download", "url", req.Url, "elapsed", time.Since(now).String())

	// merge
	args := fmt.Sprintf("cd %s && ffmpeg -i index.m3u8 -c copy %s && mv %[2]s %s", tsDirectory, filename, directory)
	cmd := exec.Command("/bin/sh", "-c", args)
	if err = cmd.Run(); err != nil {
		slog.Info(args)
		slog.Error("merge", "err", err, "url", req.Url)
		return
	}
	slog.Info("Merge to "+filepath.Join(directory, filename), "elapsed", time.Since(now).String())
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
