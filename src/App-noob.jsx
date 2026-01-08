import { useEffect, useState } from 'react'
import './App.css'

//Class Component
// class ClassComponent extends React.Component {
//   render() {
//     return (
  //   <>
  //     <h2>Hello</h2>
  //   </>
  // )
//   }
// }


// function App() {
//   return (
//     <>
//       <h2>Hello</h2>
//     </>
//   )
// }
const Card = ({title}) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log(title + hasLiked)
  }, [hasLiked, title])

  return (
    <div className='card' onClick={() => setCount(prevCount => prevCount + 1)}>
      <h2>{title} - {count}</h2>
      <button onClick={() => setHasLiked(!hasLiked)}>
        {hasLiked ? '❤️' : '🤍'}
      </button>
    </div>
  )
}

const App = () => {
  return (
    <>
    <h1 className="text-3xl font-bold underline">
    Hello world!
  </h1>
    <div className='card-container'>
      <Card title="Star Wars"></Card>
      <Card title="Star Wars2"></Card>
      <Card title="Star Wars3"></Card>
    </div>
    </>
  )
}


export default App


