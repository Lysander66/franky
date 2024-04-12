package v1

type DownloadReq struct {
	Url         string            `json:"url"`
	Name        string            `json:"name"`
	Directory   string            `json:"directory"`
	NumParallel int               `json:"num_parallel"`
	UseProxy    int               `json:"use_proxy"`
	Headers     map[string]string `json:"headers"`
}
