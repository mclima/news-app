import Header from './components/Header'
import Nav from './components/Nav'
import Stories from './components/Stories'
import { useState, useEffect } from 'preact/hooks'

const NAVITEMS = ['arts', 'books', 'fashion', 'food', 'movies', 'travel']
const FETCH_URL = 'https://api.nytimes.com/svc/topstories/v2/'
const NYT_API = 'L9v8dHMjUlDAG1DtNjhBsiYyUO6VFhhC'

export function App() {
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(false)
  const [section, setSection] = useState('')

  useEffect(() => {
    const url = new URL(window.location.href)
    const hash = url.hash.slice(1)
    // console.log('hash is of type ' + typeof hash)
    // console.log('hash  length  ' + hash.length)
    // console.log('hash ' + hash)
    // console.log('hash is true or false ' + (hash === ''))
    if (hash && hash.length !== 0 && hash !== 'undefined' && hash !== '') {
      setSection(hash)
    } else {
      setSection('arts')
    }
  }, []) // Run this effect only once when the component mounts

  useEffect(() => {
    if (!localStorage.getItem(section)) {
      console.log('fetching from NYT')
      console.log(`${FETCH_URL}${section}.json?api-key=${NYT_API}`)
      setLoading(true)
      fetch(`${FETCH_URL}${section}.json?api-key=${NYT_API}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.results)
          setStories(data.results)
          setLoading(false)
        })
        .catch((error) => {
          console.error(error)
          setLoading(false)
        })
    } else {
      console.log('section is in storage, not fetching')
      setStories(JSON.parse(localStorage.getItem(section)))
      setLoading(false)
    }
  }, [section])

  useEffect(() => {
    console.log('setting localstorage')
    localStorage.setItem(section, JSON.stringify(stories))
  }, [stories])

  useEffect(() => {
    if (loading) {
      const tl = gsap.timeline({ repeat: -1 })
      tl.set('#c1', { autoAlpha: 0.7 })
        .to('#c1', {
          duration: 0.5,
          scale: 0.2,
          x: '+=5',
          transformOrigin: '50% 50%',
        })
        .to('#c1', {
          duration: 0.5,
          scale: 1,
          x: '-=5',
          transformOrigin: '50% 50%',
        })

      const tl2 = gsap.timeline({ repeat: -1 })
      tl2
        .set('#c2', { autoAlpha: 0.7 })
        .to('#c2', {
          duration: 0.5,
          scale: 0.2,
          x: '-=5',
          transformOrigin: '50% 50%',
        })
        .to('#c2', {
          duration: 0.5,
          scale: 1,
          x: '+=5',
          transformOrigin: '50% 50%',
        })

      return () => {
        tl.kill()
        tl2.kill()
      }
    }
  }, [loading])

  if (loading) {
    return (
      <div className="loading">
        <svg
          viewBox="0 0 64 64"
          width="120px"
          height="64px"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle id="c1" cx="32" cy="32" r="32" fill="#ccf" />
          <circle id="c2" cx="56" cy="32" r="32" fill="#d32539" />
        </svg>
      </div>
    )
  }

  return (
    <>
      <Header siteTitle="NYTimes Top Stories" />
      <Nav navItems={NAVITEMS} setSection={setSection} section={section} />
      <p className="page-note">
        If the page does not retrieve articles, it may be because the HTTP
        requests to the NYTimes feed have reached their daily limit, or there
        were no articles available for the selected category in the feed.
      </p>
      <p className="page-note">
        The NYTimes allows 500 requests per day and <b>5 requests per minute</b>
        . We should sleep <b>12 seconds between calls</b> to avoid hitting the
        per minute rate limit.
      </p>
      <Stories stories={stories} section={section} />
    </>
  )
}
