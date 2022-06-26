import React from 'react';
import Nav from '../../Utility Components/Nav';
import { withRouter } from 'react-router';
import { Loader } from 'semantic-ui-react';
import Footer from '../../Footer/Footer';
import { Card } from 'semantic-ui-react'
import { getCompletedServices } from '../../../actions/user';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

const ServiceDetails = props => {
    // if(!props.location.render)
    //     props.history.replace('searchResult');
    const [activeState, setActiveState] = useState('Waiting');
    const [bookings, setBookings] = useState([]);
    const [displayList, setDisplayList] = useState([]);
    const { user, userAuth } = useSelector(st => st);
    let dispatch = useDispatch();
    useEffect(()=>{
        dispatch(getCompletedServices());
        if(user && userAuth.user)
        user.userSocket.emit('activeServices', userAuth.user._id);
        console.log(user);
    },[])
    useEffect(()=>{
        if(user.userSocket)
        user.userSocket.on('inProcessServices', (res)=>{
            console.log("COMIng", res);
            setBookings(res)
        })
    }, [user.userSocket])

    React.useEffect(() => {
        if(!bookings.length) {
            return;
        }
        if(activeState === 'Completed') {
            if(user.completedServices && user.completedServices.length)
            setDisplayList(user.completedServices.filter(book => book.status === activeState));
        } else {
            setDisplayList(bookings.filter(book => book.status === activeState));
        }
    }, [bookings, activeState]);
    return (
        <React.Fragment>
            <Loader/>
            <Nav/>
            <div style={{width: '100%', minHeight: '85vh', padding: '30px'}}>
            {/* <h3 className='ui block header'>Service Details</h3> */}
            <div style={{width: '80%', margin: '50px auto'}}>
                {bookings.length ? 
                    // <h3 className='ui block header'>Active Services</h3>
                    <div className="ui three steps">
                        <div onClick={() => setActiveState('Waiting')} className={` ${activeState === 'Waiting' ? 'active' : ' '} step`}>
                            <i className="payment icon"></i>
                            <div className="content">
                            <div className="title">Waiting</div>
                            </div>
                        </div>
                        <div onClick={() => setActiveState('Active')} className={` ${activeState === 'Active' ? 'active' : ' '} step`}>
                            <i className="info icon"></i>
                            <div className="content">
                            <div className="title">Active</div>
                            </div>
                        </div>
                        <div onClick={() => setActiveState('Completed')} className={` ${activeState === 'Completed' ? 'active' : ' '} completed step`}>
                            <i className="truck icon"></i>
                            <div className="content">
                            <div className="title">Completed</div>
                            </div>
                        </div>
                    </div>
                    : null
                }
                {/* {
                    bookings.length ? 
                    bookings.map((service, index)=>{
                        return  <div key={index} className={`ui ${service.status === 'Active'? 'primary': 'warning'} message`}>
                              <div className="header" style={{color: `${service.status === 'Active' ? 'blue': '#f0ad4e'}`}}>{service.status}</div>
                              <li> <b>Service Type:</b> {service.serviceType}</li>
                              <li> <b>Vehicle Type:</b> {service.vehicleType}</li>
                              <li> <b>Vehicle Make:</b> {service.vehicleMake}</li>
                              <li> <b>Vehicle Number:</b> {service.vehicleNo}</li>
                              <li> <b>Service Station Name:</b> {service.serviceStation.name}</li>
                              <li> <b>Area:</b> {service.serviceStation.area}</li>
                          </div>
                      })
                    :
                    null
                }
                {user.completedServices && user.completedServices.length ? 
                <h3 className='ui block header'>Completed Services</h3>
                : null
                }
                {user.completedServices && user.completedServices.length  ? 
                (
                    user.completedServices.map((service, index)=>{
                      return  <div key={index} className="ui success message">
                                <div className="header" style={{color: '#21ba45'}}>{service.status}</div>
                                <li> <b>Service Type:</b> {service.serviceType}</li>
                                <li> <b>Vehicle Type:</b> {service.vehicleType}</li>
                                <li> <b>Vehicle Make:</b> {service.vehicleMake}</li>
                                <li> <b>Vehicle Number:</b> {service.vehicleNo}</li>
                                <li> <b>Service Station Name:</b> {service.serviceStation.name}</li>
                                <li> <b>Area:</b> {service.serviceStation.area}</li>
                                <div style={{marginTop: '20px'}} className="ui fluid action input">
                                    <input type="text" placeholder="Comment here..." />
                                    <div className="ui success button">Submit</div>
                                </div>
                            </div>
                    })
                
                ) :
                !bookings.length ? ( <div style={{textAlign: 'center'}}>
                    <h2 style={{color: '#333'}}>YOU DONT HAVE ANY SERVICE YET!</h2>
                    <div className="ui animated blue button" style={{width: '50%'}} tabIndex="0">
                        <div className="visible content" >TRY IT NOW</div>                
                        <div className="hidden content" >BOOK SERVICE</div>
                    </div>
                </div>  ) : null
                } */}
                <div className="ui cards">
                    { 
                        displayList.map((waiting, index)=>{
                            return <div key={index} className="card r-card">
                            <div className="content">
                            <img className="right floated mini ui image" alt="" src={require('../../../assets/men.png')}/>
                            <div className="header">
                            </div>
                            <div className="meta">
                                <b>Contact:</b> {waiting.contactNo}
                                <br/>
                                <b>Requested Time:</b> {new Date(waiting.date).toLocaleString()}
                            </div>
                            <div className="description">
                                <h5 className="s-types green">
                                    <ul>
                                        {
                                            waiting.serviceType.map((type, ind)=> {
                                                return <li key={ind}>{type}</li>
                                            })
                                        }
                                    </ul>
                                </h5>
                                <h6 className="r-h5">STATUS: <span style={{color: `${waiting.status === 'Completed' ? '#21ba45' : '#f0ad4e'}`}} >{waiting.status}</span></h6>
                                <ul className="r-ul">
                                    <li> <b>VEHICLE NAME: </b> {waiting.vehicleMake}</li>
                                    <li> <b>VEHICLE TYPE: </b> {waiting.vehicleType}</li>
                                    <li> <b>VEHICLE NUMBER: </b> {waiting.vehicleNo}</li>
                                </ul>
                                <h6>Alloted Process Time: <span className="green">{waiting.timeForService}</span></h6>
                                <h6>Vehicle Serving Start Time: <span className="red">{new Date(waiting.estimatedStartTime).toLocaleTimeString()}</span></h6>
                            </div>
                            </div>
                        </div>
                        })
                    }
                </div>
            </div>
            </div>
            <Footer/>
        </React.Fragment>
        
    )
}
export default withRouter(ServiceDetails);