import React from '../../../node_modules/react';
import Header from './header';
import Body from './body';


class Search extends React.Component {
  state={
    query:"",
    bodyHeight:'auto'
  }
  doSearch = (par) => {
      this.setState({ query:par })
  }
  
  setBodyHeight = (par) => {
    this.setState({bodyHeight:par})
  }

  render(){
    const {bodyHeight} = this.state;
    return (
      <div className="Wrapper" >
        <Header doSearch={this.doSearch} setBodyHeight={this.setBodyHeight}  />
        <Body query={this.state.query} bodyHeight={bodyHeight}/>
      </div>
    );
  }
}

export default Search;
