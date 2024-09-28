package v1

type DownloadReq struct {
	URL       string            `json:"url"`
	Proxy     string            `json:"proxy"`
	Threads   uint              `json:"threads"`
	Directory string            `json:"directory"`
	Filename  string            `json:"filename"`
	Headers   map[string]string `json:"headers"`
}
