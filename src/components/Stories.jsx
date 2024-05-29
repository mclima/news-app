import Story from './Story'

const Stories = ({ stories, section }) => {
  let content
  if (stories.length !== 0) {
    //copy data to new array, sort it, and map it
    content = [...stories]
      .sort((a, b) => (a.title > b.title ? 1 : -1))
      .map((story, index) => {
        if (
          (story.title && story.section === section) ||
          (story.title && story.section === 'dining')
        ) {
          return <Story key={index} story={story} />
        }
        return null // Ensure a valid return even if the title is missing
      })
  } else {
    content = <p className="page-note">There are no articles for this feed.</p>
  }

  return <div className="site-wrap">{content}</div>
}

export default Stories
