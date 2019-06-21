import React, { Component } from 'react';
import Logo from '../../assets/images/mds-logo.svg';
import Spinner from '../../assets/images/rolling_100.gif';
import ArrowDown from '../../assets/images/chevron-down.svg';
import NotFound from './notFound';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';


let result=[];

export class body extends Component {
    constructor(props){
        super(props);
        this.state = {
            query:"",
            isLoaded:true,
            windowWidth:window.innerWidth,
            dropdownData:{
                dropdownList:['Populer','Terbaru','Harga Terendah','Harga Tertinggi','Diskon Terendah','Diskon Tertinggi'],
                showDropdown:false,
                activeIndex:0
            },
            errorSearch:false,
            data:[],
            loopStatus:{
                currentLoop:0,
                totalLoop:null,
                loopLeft:null,
                loopLoader:false
            },
            dataCount:null
        }
    }

    setWindowDimension = () => {
        this.setState({
            windowWidth: window.innerWidth
        })
    }

    isBottom(el) {
        return Math.floor(el.getBoundingClientRect().bottom) <= window.innerHeight;
    }

    componentDidMount(){
        document.addEventListener('scroll', this.trackScrolling);
        window.addEventListener("resize", this.setWindowDimension); 
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
        window.removeEventListener("resize", this.setWindowDimension);
    }
    
    loadNextData(){
        const {dataCount,loopStatus} = this.state;
        if(dataCount!==null){
            let countDivide = Math.floor(dataCount/36);

            document.removeEventListener('scroll', this.trackScrolling);
            setTimeout(
                function() {
                    document.addEventListener('scroll', this.trackScrolling);
                }
                .bind(this),
                1000
            );

            this.setState({
                loopStatus:{
                    ...loopStatus,
                    currentLoop:loopStatus.currentLoop+1,
                    totalLoop:countDivide,
                    loopLeft:dataCount-(36*countDivide)
                }
            },()=>{
                if(this.state.loopStatus.currentLoop<=this.state.loopStatus.totalLoop){
                    this.setState({
                        loopStatus:{
                            ...this.state.loopStatus,
                            loopLoader:true
                        }
                    },()=>{
                        this.getData(this.state.query);
                    })
                }
            })

        }
    }

    trackScrolling = () => {
        const wrappedElement = document.getElementById('bodyBase');
        if (this.isBottom(wrappedElement)) {
            this.loadNextData();
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

    getData = (par,sort) =>{
        const {loopStatus} = this.state;
        let perPage = loopStatus.currentLoop === loopStatus.totalLoop ? loopStatus.loopLeft : 36;
        let sorting = sort!==undefined ? 
                      (sort!==false?"&sort="+this.getSortData(sort):"&sort=energy+DESC"):"&sort=energy+DESC";
        
        
        axios.get('https://services.mataharimall.com/products/v0.2/products/search?q='+par+'&per_page='+perPage+sorting)
        .then(res => {
            let datas = res.data.data;
            result = [
                ...this.state.data,
                ...datas.products
            ];

            this.setState({
                data:result,
                dataCount:datas.info.product_count,
                isLoaded:true,
                errorSearch:false,
                bodyHeight:datas.info.product_count!==undefined?this.state.bodyHeight: this.state.bodyHeight,
                loopStatus:{
                    ...this.state.loopStatus,
                    loopLoader:false
                }
            });
        })
        .catch(err=>{
            this.setState({isLoaded:true,errorSearch:true})
        });

    }
    

    componentWillReceiveProps({query,bodyHeight}) {
        this.setState({
            query:query,
            bodyHeight:bodyHeight+'px',
            data:[],
            loopStatus:{
                currentLoop:0,
                totalLoop:null,
                loopLeft:null
                
            },
            dataCount:null
        },()=>{
            if(query!==''){
                this.setState({isLoaded:false},()=>this.getData(query));
                
            }
        })        
    }

    showListDropdown(par){
        const {dropdownData} = this.state;

        this.setState({
            dropdownData:{
                ...dropdownData,
                showDropdown:dropdownData.showDropdown?false:true,
                activeIndex:par!==undefined?par:dropdownData.activeIndex
            }
        },()=>{
            if(par!==undefined){
                this.setState({
                    data:[],
                    loopStatus:{
                        currentLoop:0,
                        totalLoop:null,
                        loopLeft:null
                    },
                    isLoaded:false
                },()=>{
                    this.getData(this.state.query,par);
                })
            }   
        });

    }

    render() {
        const {query,data,dataCount,bodyHeight,isLoaded,windowWidth,dropdownData,errorSearch} = this.state;
        if(isLoaded){
            if(query===""){
                return (
                    <section className="body" style={{textAlign:"center",height:bodyHeight,lineHeight:bodyHeight,padding:0}} id="bodyBase">
                        <img src={Logo} alt="" className="logo" />
                    </section>
                )
            }else{
                if (result.length !== 0) {
                    if(dataCount!==null){
                        return(
                            <section className="body" id="bodyBase">
                                <h1>"{query}" <span>{dataCount} products found</span></h1>
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
                                    data.map((item,index)=>
                                        <div 
                                            className="col" 
                                            key={index} ind={index} 
                                             >
                                                <div className="colInside">
                                                    <LazyLoadImage 
                                                        alt={item.product_title}
                                                        className={'productImage'} 
                                                        src={windowWidth>=400?item.images[0].thumbnail400:item.images[0].thumbnail200} 
                                                        onMouseOver={e => {
                                                            e.currentTarget.src = windowWidth>=400?item.images[1].thumbnail400:item.images[1].thumbnail200;
                                                        }}
                                                        onMouseOut={e => {
                                                            e.currentTarget.src = windowWidth>=400?item.images[0].thumbnail400:item.images[0].thumbnail200;
                                                        }}
                                                        effect="blur"
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
                                
                                { this.state.loopStatus.loopLoader?
                                    <div className="loadingScrollWrap">
                                        <img src={Spinner} alt="Matahari Loading Gif" className="loadingScroll"/> 
                                    </div> : null
                                }
                            </section>
                        )
                    }else{
                        return(
                            <NotFound query={query} bodyHeight={bodyHeight}/>
                        )
                    }
                }else{
                    return(
                        <NotFound query={query} bodyHeight={bodyHeight}/>
                    )
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
