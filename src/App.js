import React from 'react';
import { act } from 'react-dom/test-utils';
import axios from 'axios'
import styles from './App.module.css';
import styled from 'styled-components';

const StyledContainer = 
styled.div`
height: 100vw;
padding: 20px;
background: #83a4d4;
background: linear-gradient(to left, #b6fbff, #83a4d4);
color: #171212;
  `;


const welcome = {
  greeting: 'Hey',
  title: 'React',
};

const useSemiPersistentState = (key, initialState) => {
  //Initial state
  const [value, setValue] = React.useState(
    localStorage.getItem('key') || initialState
  );
  React.useEffect(() => {
    localStorage.setItem('key', value)
  }, [value, key])

  return [value, setValue];
}

const storiesReducer = (state, action) => {

  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      }

    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(story => action.payload.objectID !== story.objectID),
      }

    default:
      throw new Error();
  }
}

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {


  //Initial state
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`)
  const handleSearchInput = event => {
    setSearchTerm(event.target.value)
  }
  const handleSearchSubmit = event => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault();
  }
  // const [stories, setStories ] = React.useState([]);
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false
  });


  const handleFetchStories = React.useCallback(
    async () => {
      if (!url) return;
      dispatchStories({ type: 'STORIES_FETCH_INIT' })

      try {
        const result = await axios.get(url)
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.data.hits,
        })

      } catch{
        dispatchStories({
          type: 'STORIES_FETCH_FAILURE'
        })
      }
    },
    [url]//c
  )

  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    dispatchStories({ type: 'REMOVE_STORY', payload: item })
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }


  return (
    <StyledContainer>
      <h1 className={styles.headlinePrimary}> {welcome.greeting}{welcome.title}!</h1>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <hr />
      {stories.isError && <p>Something went wrong ...</p>}
      {
        stories.isLoading ? (<p>Loading ...</p>) :
          (
            <List list={stories.data}
              onRemoveItem={handleRemoveStory}
            />
          )
      }
    </StyledContainer>
  );
};


const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}) => (
    <form onSubmit={onSearchSubmit} className="search-form">
      <InputWithLabel id="search" value={searchTerm} isFocused onInputChange={onSearchInput}>
        <strong>Search:</strong>
      </InputWithLabel>
      <button className="button button-large" type="submit" disabled={!searchTerm}>Submit</button>

    </form>
  )
const Item = ({ item, onRemoveItem }) => {

  const handleRemoveItem = () => {
    onRemoveItem(item)
  }
  return (
    <div className={styles.item}>
      <span style={{ width:'40%'}}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{ width:'30%'}}>
        {item.author}
      </span>
      <span style={{ width:'10%'}}>
        {item.num_comments}
      </span>
      <span style={{ width:'10%'}}>
        {item.points}
      </span>
      <span style={{ width:'10%'}}>
        <button className={`${styles.button} ${styles.buttonSmall}`} type="button" onClick={handleRemoveItem}>Dismiss</button>
      </span>
    </div>
  )
}

const List = ({ list, onRemoveItem }) => list.map(item => <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />)

const InputWithLabel = ({ id, value, type = 'text', onInputChange, isFocused, children }) => {
  const inputRef = React.useRef();
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused])
  return (
    <>
      <label className="label" htmlFor={id}>{children} </label>
      &nbsp;
      <input
        className="input"
        ref={inputRef}
        id={id} type={type} value={value} onChange={onInputChange}
        autoFocus={isFocused}
      ></input>
      {/* <p>searching for <strong>{searchTerm}</strong></p> */}

    </>
  );
}


export default App;

export {SearchForm, InputWithLabel, List, Item};