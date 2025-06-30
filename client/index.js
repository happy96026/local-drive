const Endpoint = {
  videos: "/videos"
}

class RestClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  get(endpoint) {
    return fetch(`${this.baseUrl}${endpoint}`)
  }
}

class LocalDriveClient {
  constructor(restClient) {
    this.restClient = restClient
  }

  getVideos() {
    return this.restClient.get(Endpoint.videos).then(res => res.json())
  }

  getVideo(name) {
    return this.restClient.get(`${Endpoint.videos}/${name}`)
  }
}

class DivView {
  constructor({ className } = {}) {
    this.element = document.createElement("div")
    if (className) {
      this.element.classList.add(className)
    }
  }

  render({ children } = {}) {
    children = children ?? []
    this.element.replaceChildren(...children)

    return this.element
  }
}

class ButtonView {
  constructor() {
    this.element = document.createElement("button")
    this.onClick = null

    this.element.addEventListener("click", () => {
      this.onClick?.()
    })
  }

  render({ text, onClick } = {}) {
    this.element.textContent = text
    this.onClick = onClick

    return this.element
  }
}

class VideoView {
  constructor() {
    this.element = document.createElement("video")
    this.source = document.createElement("source")
    this.element.appendChild(this.source)
  }

  load() {
    this.element.load()
  }

  render({ url } = {}) {
    this.element.width = 640
    this.element.height = 480
    this.element.controls = true
    this.element.autoplay = true

    this.source.src = url
    this.source.type = "video/mp4"

    return this.element
  }
}

async function main() {
  const baseUrl = `${globalThis.location.origin}/api`
  const restClient = new RestClient(baseUrl)
  const localDriveClient = new LocalDriveClient(restClient)

  const appView = new DivView({ className: "app" })
  const videoContainerView = new DivView({ className: "video-container" })
  const buttonContainerView = new DivView({ className: "button-container" })
  const videoView = new VideoView()

  document.body.appendChild(
    appView.render({
      children: [
        videoContainerView.render(),
        buttonContainerView.render(),
      ]
    })
  )

  const { files } = await localDriveClient.getVideos()
  buttonContainerView.render({
    children: files.map(({ videoName }) => new ButtonView().render({
      text: videoName,
      onClick: () => {
        const url = `${baseUrl}${Endpoint.videos}/${encodeURIComponent(videoName)}`
        videoContainerView.render({ children: [videoView.render({ url })] })
        videoView.load()
      },
    }))
  })
}

document.addEventListener("DOMContentLoaded", main)
