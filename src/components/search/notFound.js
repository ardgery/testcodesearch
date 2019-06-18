import React, { Component } from 'react';
import ImgNotFound from '../../assets/images/search-not-found.svg';

export class notFound extends Component {
    render() {
        const {query,bodyHeight} = this.props;
        return (
            <section className="body notFound" style={{textAlign:"center",padding:0}} id="bodyBase"> 
                <div className="notFound" style={{height:bodyHeight}}>
                    <div className="notFoundWrap">
                        <img src={ImgNotFound} alt="" />
                        <h1 className="sorry">Sorry :(</h1>
                        <p>No results found for "{query}".<br/>
                        Please try another keyword.</p>
                    </div>
                </div>
            </section>
        )
    }
}

export default notFound
