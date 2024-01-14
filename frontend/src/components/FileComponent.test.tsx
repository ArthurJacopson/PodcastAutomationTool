import { render, screen, fireEvent } from "@testing-library/react";
import { Router } from "react-router-dom";
import { createMemoryHistory } from 'history';
import FileComponent from "./FileComponent";
import { sizeConversion} from "../utils"



test('Component is created with correct contents, as defined in sampleData', () => {

    const sampleData = { 
        slug: "a", 
        name: "Project A",
        size: sizeConversion(15000),
        component_type: "project"
        
    }
    const history = createMemoryHistory();
    history.push = jest.fn();

    render(
        <FileComponent 
            slug={sampleData.slug}
            name={sampleData.name}
            size={sampleData.size}
            component_type={sampleData.component_type}
        />
    )

    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Size: 15.00KB')).toBeInTheDocument();
    
});
