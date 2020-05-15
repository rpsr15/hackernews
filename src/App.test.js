import React from 'react';
import { render } from '@testing-library/react';
import App,{ Item, List, SearchForm, InputWithLabel} from './App';


describe('Item',()=>{
  const item = {
    title:'React',
    url:'https://reactjs.org',
    author:'Jordan Walke',
    num_comments: 3,
    pionts: 4,
    objectID: 0,
  };

  it('renders all properties',()=>{
    const component = render.create(<Item item={item}/>);
    expect(component.root.findByType('a').props.href).toEqual('https://reactjs.org/');
    expect(component.root.findAllByProps({children:'Jordan Walke'}).length).toEqual(1);
  });
});