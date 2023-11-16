import renderer, { ReactTestRenderer, ReactTestRendererJSON } from 'react-test-renderer';
import FileComponent from './FileComponent';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

it('renders the component', () => { 

    const sampleData = { slug: "a", name: "Project A", date: "Oct 25, 2023", size: 55.71 }

    const routes = [
        {
            path: '/test',
            element: <FileComponent 
                        slug={sampleData.slug} 
                        name={sampleData.name} 
                        date={sampleData.date}
                        size={sampleData.size}
                    />,
        },
    ];

    const router = createMemoryRouter(routes, {
        initialEntries: ['/test'],
        initialIndex: 0,
    });

    const component = renderer.create(
        <RouterProvider router={router} />
    ) as ReactTestRenderer;
    let tree = component.toJSON() as ReactTestRendererJSON;
    expect(tree).toMatchSnapshot();
});
