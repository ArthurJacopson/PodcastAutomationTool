import renderer from 'react-test-renderer';
import Navbar from './Navbar';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { getByText } from '@testing-library/react';

it('Has the correct title', () => {
    const title = "Podplistic";
    const component:any = renderer.create(
        <Router>
           <Navbar title={title} />
        </Router>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
