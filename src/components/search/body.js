import React, { Component } from 'react';
import Logo from '../../assets/images/mds-logo.svg';
import ImgNotFound from '../../assets/images/search-not-found.svg';
import Spinner from '../../assets/images/rolling_100.gif';
import axios from 'axios';

let heightTemp = [];

export class body extends Component {
    constructor(props){
        super(props);
        this.state = {
            query:"",
            bodyHeightSave:'auto',
            scrolledState:0,
            sortedData:'populer',
            absHeight:'auto',
            isLoaded:true,
            windowWidth:'',
            windowHeight:'',
            tempHeight:[]
        }
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    componentWillMount(){
        console.log("MASUK WILL MOUNT");
        
    }

    setWindowDimension = () => {
        this.setState({
            windowWidth: window.innerWidth, 
            windowHeight: window.innerHeight
        },()=>{
            console.log("STATE WINDOW WIDTH = ",this.state.windowWidth);
        })
    }

    componentDidMount(){
        document.addEventListener('scroll', this.trackScrolling);
        window.addEventListener("resize", this.setWindowDimension); 
        console.log("MASUK DID MOUNT");

        console.log("THIS COLUMN =",this.column);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
        window.removeEventListener("resize", this.setWindowDimension);
        console.log("MASUK WILL UNMOUNT")
    }

    heightSync(par){
        if(par!==undefined && !isNaN(par)){
            heightTemp.push(par);

        }
        console.log("HEIGHT TEMPPP =",heightTemp);

        Array.prototype.max = function() {
            return Math.max.apply(null, this);
        };
        console.log("BEST HEIGHT = ",heightTemp.max());

        this.setState({
            heightSync:heightTemp.max(),
            windowWidth: window.innerWidth, 
            windowHeight: window.innerHeight
        })
    }

    trackScrolling = () => {
        const {scrolledState} = this.state;
        const wrappedElement = document.getElementById('bodyBase');
        if (this.isBottom(wrappedElement)) {
            this.setState({scrolledState:scrolledState+1},()=>{
                if(this.state.scrolledState > scrolledState){
                    console.log("bottom reached!")
                }
            });
            document.removeEventListener('scroll', this.trackScrolling);
        }
    };

    getSortData(par){
        let sortResult;
        if(par==='populer'){
            sortResult = 'energy+DESC'
        }else if(par==='terbaru'){
            sortResult = 'date+DESC'
        }else if(par==='harga_terendah'){
            sortResult = 'pricing+ASC'
        }else if(par==='harga_tertinggi'){
            sortResult = 'pricing+DESC'
        }else if(par==='diskon_terendah'){
            sortResult = 'discount+ASC'
        }else if(par==='diskon_tertinggi'){
            sortResult = 'discount+DESC'
        }
        return sortResult;
    }

    getData(par,sort){
        this.setState({isLoaded:false});
        const {bodyHeight} = this.state;
        console.log("SORT = ",sort);
        console.log("HOHO = ",document.documentElement.scrollHeight);
        let sorting = sort!==undefined? "&sort="+this.getSortData(sort):"&sort=energy+DESC";
        
        axios.get('https://services.mataharimall.com/products/v0.2/products/search?q='+par+'&per_page=36'+sorting)
        .then(res => {
            console.log('Res =',res.data.data);
            let datas = res.data.data;
            this.setState({data:datas,isLoaded:true,bodyHeight:datas.info.product_count!==undefined?this.state.bodyHeight: this.state.bodyHeight });
        })
    }
    componentWillReceiveProps({query,bodyHeight}) {
        this.setState({query:query,bodyHeight:bodyHeight+'px',bodyHeightSave:bodyHeight+'px'},()=>{
            if(query!==''){
                this.getData(query);
            }
        })
        console.log("QUERYY = ",query);
        
    }

    sortData = (e) =>{
        console.log("e.target.value",e.target.value);
        this.setState({sortedData:e.target.value},()=>{
            this.getData(this.state.query,this.state.sortedData);
        })
    }

    render() {
        console.log("RENDERINGG...");
        const {query,data,heightSync,bodyHeight,isLoaded,windowWidth,windowHeight} = this.state;
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
                                <p className="sort">Sort by: <select onChange={this.sortData} value={this.state.sortedData}>
                                            <option value='populer'>Populer</option>
                                            <option value='terbaru'>Terbaru</option>
                                            <option value='harga_terendah'>Harga Terendah</option>
                                            <option value='harga_tertinggi'>Harga Tertinggi</option>
                                            <option value='diskon_terendah'>Diskon Terendah</option>
                                            <option value='diskon_tertinggi'>Diskon Tertinggi</option>
                                           </select>
                                </p>
                                <div className="colWrapper">
                                {
                                    data.products.map((item,index)=>
                                        <div 
                                            className="col" 
                                            key={index} ind={index} 
                                            style={{height:heightSync}} >
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
                            <section className="body notFound" style={{textAlign:"center",height:bodyHeight,padding:0}} id="bodyBase"> 
                                <div className="notFoundWrap">
                                    <img src={ImgNotFound} alt="Matahari Image Not Found" />
                                    <h1 className="sorry">Sorry :(</h1>
                                    <p>No results found for "{query}".<br/>
                                    Please try another keyword.</p>
                                </div>
                            </section>
                        )
                    }
                }else{
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
