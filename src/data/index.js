const videoA = {
  id: 'a',
  title: 'graphql lesson 1',
  duration: 120,
  watched: true,
}

const videob = {
  id: 'b',
  title: 'graphql lesson 2',
  duration: 10,
  watched: true,
}

const videos = [videoA, videob]

const getVideoById = (id) => new Promise((resolve) => {
  const [video] = videos.filter((video) => {
    return video.id === id
  })
  resolve(video)
})

const createVideo = ({ title, duration, watched }) => {
  const video = {
    id: (new Buffer(title, 'utf8')).toString('base64'),
    title,
    duration,
    watched,
  };

  videos.push(video)

  return video
}

const getVideos = () => new Promise((resolve) => resolve(videos))

const getObjectById = (type, id) => {
  const types = {
    video: getVideoById,
  }
  return types[type](id)
}

exports.getVideoById = getVideoById
exports.getVideos = getVideos
exports.createVideo = createVideo
exports.getObjectById = getObjectById
