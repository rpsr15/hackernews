import React from 'react';
import logo from './logo.svg';
import './App.css';




function List(props)
{
  return (
    <div>
      
      {
        props.stories.map((item) => <div key={item.objectID}>
          <span><a href={item.url}>{item.title}</a></span>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.points}</span
          ></div>)
      }
    </div>
  );
}
const App = () => {

const stories = [
  {
    title: 'React',
    url: 'https://reactjs.org',
    author: 'Jordan walke',
    num_comments: 3,
    poits: 4,
    ojgectID: 0
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org',
    author: 'Dan abramov, Andrew clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: 'fart theory',
    url: 'https://redux.js.org',
    author: 'Ravi',
    num_comments: 2,
    points: 5,
    objectID: 2,
  }
];

const [searchTerm, setSearchTerm] = React.useState('');
  const handleChange = (event) => {
    console.log(event.target.value);
  };

return(
  <div>
    <h1>My Hacker Stories</h1>
    <label htmlFor="search">Search: </label>
    <input id="search" type="text" onChange={handleChange}></input>
    <hr />
    <List stories={stories} />
  </div>
);
};

export default App;
