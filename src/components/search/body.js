import React, { Component } from 'react';
import Logo from '../../assets/images/mds-logo.svg';
import Spinner from '../../assets/images/rolling_100.gif';
import ArrowDown from '../../assets/images/chevron-down.svg';
import NotFound from './notFound';
import axios from 'axios';

export class body extends Component {
    constructor(props){
        super(props);
        this.state = {
            query:"",
            isLoaded:true,
            windowWidth:'',
            dropdownData:{
                dropdownList:['Populer','Terbaru','Harga Terendah','Harga Tertinggi','Diskon Terendah','Diskon Tertinggi'],
                showDropdown:false,
                activeIndex:0
            },
            errorSearch:false
        }
    }

    setWindowDimension = () => {
        this.setState({
            windowWidth: window.innerWidth, 
            windowHeight: window.innerHeight
        },()=>{
            console.log("STATE WINDOW WIDTH = ",this.state.windowWidth);
        })
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    componentDidMount(){
        document.addEventListener('scroll', this.trackScrolling);
        window.addEventListener("resize", this.setWindowDimension); 
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
        window.removeEventListener("resize", this.setWindowDimension);
    }

    trackScrolling = () => {
        const wrappedElement = document.getElementById('bodyBase');
        if (this.isBottom(wrappedElement)) {
            console.log("bottom reached!");
            document.removeEventListener('scroll', this.trackScrolling);
        }
    };

    getSortData(par){
        let sortResult;
        if(par===0){
            sortResult = 'energy+DESC';
        }else if(par===1){
            sortResult = 'date+DESC';
        }else if(par===2){
            sortResult = 'pricing+ASC';
        }else if(par===3){
            sortResult = 'pricing+DESC';
        }else if(par===4){
            sortResult = 'discount+ASC';
        }else if(par===5){
            sortResult = 'discount+DESC';
        }
        return sortResult;
    }

    getData(par,sort){
        this.setState({isLoaded:false});
        console.log("SORT = ",sort);
        console.log("HOHO = ",document.documentElement.scrollHeight);
        let sorting = sort!==undefined? "&sort="+this.getSortData(sort):"&sort=energy+DESC";
        
        axios.get('https://services.mataharimall.com/products/v0.2/products/search?q='+par+'&per_page=36'+sorting)
        .then(res => {
            console.log('Res =',res.data.data);
            let datas = res.data.data;
            this.setState({data:datas,isLoaded:true,errorSearch:false,bodyHeight:datas.info.product_count!==undefined?this.state.bodyHeight: this.state.bodyHeight });
        })
        .catch(err=>{
            console.log("ERORO = ",err);
            this.setState({isLoaded:true,errorSearch:true},()=>{console.log("ERRORSEARCH = ",this.state.errorSearch)})
        });
    }
    
    componentWillReceiveProps({query,bodyHeight}) {
        this.setState({query:query,bodyHeight:bodyHeight+'px'},()=>{
            if(query!==''){
                this.getData(query);
            }
        })
        console.log("QUERYY = ",query);
        
    }

    showListDropdown(par){
        const {dropdownData} = this.state;

        console.log("PAREPAREE = ",par)
        console.log("DROPDOWNDATA = ",dropdownData);

        this.setState({
            dropdownData:{
                ...dropdownData,
                showDropdown:dropdownData.showDropdown?false:true,
                activeIndex:par!==undefined?par:dropdownData.activeIndex
            }
        },()=>{
            if(par!==undefined){
                this.getData(this.state.query,par);
            }   
        });

    }

    render() {
        console.log("RENDERINGG...");
        const {query,data,bodyHeight,isLoaded,windowWidth,dropdownData,errorSearch} = this.state;
        if(isLoaded){
            console.log("masuk isLoaded");
            if(query===""){
                console.log("masuk query");
                return (
                    <section className="body" style={{textAlign:"center",height:bodyHeight,lineHeight:bodyHeight,padding:0}} id="bodyBase">
                        <img src={Logo} alt="" className="logo" />
                    </section>
                )
            }else{
                console.log("masuk tidak query");

                if (data !== undefined) {
                    console.log("masuk data tidak undefined");
                    if(data.info.product_count!==undefined){
                        console.log("data yg dicari ada");
                        return(
                            <section className="body" id="bodyBase">
                                <h1>"{query}" <span>{data.info.product_count} products found</span></h1>
                                <div className="dropdownArea">
                                    <div className="dropdownListWrap">
                                        <p className="sort">
                                            Sort by: <span className="dropDown" onClick={()=>this.showListDropdown()}>{dropdownData.dropdownList[dropdownData.activeIndex]}&nbsp;&nbsp;<img src={ArrowDown} alt="" className="arrowDown"/></span>
                                        </p>
                                        {
                                            dropdownData.showDropdown?
                                                <div className="dropdownList">
                                                {
                                                    dropdownData.dropdownList.map((item,index)=> 
                                                        <p 
                                                            key={index} 
                                                            className={index===dropdownData.activeIndex?'active':''}
                                                            onClick={()=>this.showListDropdown(index)}>{item}</p>
                                                    )
                                                }
                                                </div>
                                            : null
                                        }
                                    </div>
                                </div>
                                <div className="colWrapper">
                                {
                                    data.products.map((item,index)=>
                                        <div 
                                            className="col" 
                                            key={index} ind={index} 
                                             >
                                                <div className="colInside">
                                                    <img 
                                                        alt={item.product_title}
                                                        className={'productImage'} 
                                                        src={windowWidth>=400?item.images[0].thumbnail400:item.images[0].thumbnail200} 
                                                        onMouseOver={e => {
                                                            e.currentTarget.src = windowWidth>=400?item.images[1].thumbnail400:item.images[1].thumbnail200;
                                                        }}
                                                        onMouseOut={e => {
                                                            e.currentTarget.src = windowWidth>=400?item.images[0].thumbnail400:item.images[0].thumbnail200;
                                                        }}
                                                        />
                                                    <p className="productTitle">{item.brand.name}</p>
                                                    <p className="productDesc">{item.product_title}</p>
                                                    <p className="realPrize">{item.pricing.formatted.effective_price}</p>
                                                    <p className="prize">{item.pricing.formatted.base_price}</p>
                                                </div>
                                        </div>
                                    )
                                }
                                </div>
                            </section>
                        )
                    }else{
                        console.log("data yg dicari tidak ada");
                        return(
                            <NotFound query={query} bodyHeight={bodyHeight}/>
                        )
                    }
                }else{
                    if(errorSearch){
                        return(
                            <NotFound query={query} bodyHeight={bodyHeight}/>
                        )
                    }
                    return null;
                }
            }
        }else{
            return (
                <section className="body" style={{textAlign:"center",height:bodyHeight,lineHeight:bodyHeight,padding:0}} id="bodyBase">
                    <img src={Spinner} alt="Matahari Loading Gif" className="loadingGif"/>
                </section>
            );
        }



    }
}

export default body
