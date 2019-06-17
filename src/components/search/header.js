import React, { Component } from 'react';

export class header extends Component {
    state={
        query:""
    }
    handleChange = (e) => {
        this.setState({query:e.target.value});
    }
    doSearch = (e) => {
        const {doSearch} = this.props;
        if (e.key === 'Enter') {
            doSearch(this.state.query);
          }
    }
    componentDidMount(){
        const {setBodyHeight} = this.props;
        const height = this.divElement.clientHeight;
        setBodyHeight(document.documentElement.scrollHeight - height);
    }
    render() {
        return (
            <section className="header" id="headerWrap" ref={ (divElement) => {this.divElement = divElement}}  >
                <input 
                    type="text" 
                    placeholder="Search here ..." 
                    onChange={this.handleChange} 
                    onKeyDown={this.doSearch} />
            </section>
        )
    }
}

export default header
