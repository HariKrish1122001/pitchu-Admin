import React, { useEffect, useState } from 'react'
import "../assets/css/Dashboard.css"
import { getPlan, updatePlan } from "../api/adminControl";
import { encryptData, decryptData } from "./utils/securedata";
import { toast } from 'react-toastify';

function Plan() {
    const [planDetails, setPlanDetails] = useState([]);
    const [internationalstatus, setInternationstatus] = useState(false);
    const [planstatusD, setplanstatusD] = useState('Low');
    const [planstatusI, setplanstatusi] = useState('Low');
    const [input, setInput] = useState();


    const getPlans = async () => {
        try {

            const res = await getPlan();
            if (res.status == true) {
                const de = await decryptData(res.data);
                setPlanDetails(de);
            }
        } catch (error) {
            console.log(error);
            setPlanDetails([]);
        }
    }

    useEffect(() => {
        getPlans()
    }, []);


    const handleChange = async (e) => {
        try {
            const value = e;

            // Check if the input contains only numbers
            if (/^\d*$/.test(value)) {
                setInput(value); // Update state only if input is a number
            } else {
                console.log("Invalid input: Only numbers are allowed");
            }
        } catch (error) {
            console.log(error);
        }
    };

    
    const handleSubmit = async () => {
        try {
    
            // Validate input (ensure it's a positive number)
            if (!input || isNaN(input) || Number(input) <= 0) {
                toast.warn("Give a correct value.");
                return;
            }
    
            // Define the object properly before using it
            let obj = {
                status: internationalstatus ? 1 : 0,
                type: internationalstatus ? planstatusI : planstatusD,
                _id: internationalstatus ? planDetails[1]._id : planDetails[0]._id,
                amount: input
            };
   
            const en = encryptData(obj);
            const res = await updatePlan(en);
    
            if (res?.status) {
                toast.success("Change plan success.");
            } else {
                toast.error("Change plan failed.");
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            toast.error("Change plan failed.");
        }
    };
    

    return (
        <div className="App">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-10">
                        <div className="Route2-active-class">
                            <div className="variable-domestic-dashboard custom-plan">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <h2>Plan</h2>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <div>
                                            <ul class="nav nav-pills mb-3 justify-content-center" id="pills-tab" role="tablist">
                                                <li class="nav-item me-5" role="presentation ">
                                                    <button class="nav-link active" id="pills-domestic-tab" data-bs-toggle="pill" data-bs-target="#pills-domestic" type="button" role="tab" aria-controls="pills-domestic" aria-selected="true"
                                                        onClick={() => {
                                                            setInternationstatus(false);
                                                            setInput('');
                                                        }}>Domestic</button>
                                                </li>
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link" id="pills-international-tab" data-bs-toggle="pill" data-bs-target="#pills-international" type="button" role="tab" aria-controls="pills-international" onClick={() => {
                                                        setInternationstatus(true);
                                                        setInput('');
                                                    }} aria-selected="false">International</button>
                                                </li>
                                            </ul>
                                            <div class="tab-content" id="pills-tabContent">
                                                <div class="tab-pane fade show active" id="pills-domestic" role="tabpanel" aria-labelledby="pills-domestic-tab" tabindex="0">
                                                    <div className='row mt-5 justify-content-center'>
                                                        <div className='col-lg-6'>
                                                            <ul class="nav nav-pills mb-3" id="pills-subdomestic-tab" role="tablist">
                                                                <li class="nav-item" role="presentation">
                                                                    <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true"
                                                                        onClick={() => {
                                                                            setplanstatusD('Low');
                                                                            setInput('');
                                                                        }} >Low</button>
                                                                </li>
                                                                <li class="nav-item" role="presentation">
                                                                    <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false"
                                                                        onClick={() => {
                                                                            setplanstatusD('Medium');
                                                                            setInput('');
                                                                        }}>Medium</button>
                                                                </li>
                                                                <li class="nav-item" role="presentation">
                                                                    <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false"
                                                                        onClick={() => {
                                                                            setplanstatusD('High');
                                                                            setInput('');
                                                                        }}>High</button>
                                                                </li>
                                                            </ul>
                                                            <div class="tab-content" id="pills-tabContent">
                                                                <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
                                                                    <div className='custom-plan-nav-tabs'>
                                                                        <div class="mb-3">
                                                                            <label for="exampleInputEmail1" class="form-label">₹ {planDetails.length > 0 ? planDetails[0].Low : 0}</label>
                                                                            <input type="number" value={input} min="0" class="form-control" id="exampleInputEmail1" onChange={(e) => { handleChange(e.target.value) }} aria-describedby="emailHelp" />
                                                                        </div>
                                                                        <div className='text-center'>
                                                                            <button className='dashboard-btn-1' onClick={() => { handleSubmit() }} >Submit</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
                                                                    <div className='custom-plan-nav-tabs'>
                                                                        <div class="mb-3">
                                                                            <label for="exampleInputEmail1" class="form-label">₹ {planDetails.length > 0 ? planDetails[0].Medium : 0}</label>
                                                                            <input type="number" value={input} min="0" class="form-control" id="exampleInputEmail1" onChange={(e) => { handleChange(e.target.value) }} aria-describedby="emailHelp" />
                                                                        </div>
                                                                        <div className='text-center'>
                                                                            <button className='dashboard-btn-1' onClick={() => { handleSubmit() }} >Submit</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">
                                                                    <div className='custom-plan-nav-tabs'>
                                                                        <div class="mb-3">
                                                                            <label for="exampleInputEmail1" class="form-label">₹ {planDetails.length > 0 ? planDetails[0].High : 0}</label>
                                                                            <input type="number" value={input} min="0" class="form-control" id="exampleInputEmail1" onChange={(e) => { handleChange(e.target.value) }} aria-describedby="emailHelp" />
                                                                        </div>
                                                                        <div className='text-center'>
                                                                            <button className='dashboard-btn-1' onClick={() => { handleSubmit() }} >Submit</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane fade" id="pills-international" role="tabpanel" aria-labelledby="pills-international-tab" tabindex="0">
                                                    <div className='row  justify-content-center mt-5'>
                                                        <div className='col-lg-6'>
                                                            <ul class="nav nav-pills mb-3" id="pills-subinternational-tab" role="tablist">
                                                                <li class="nav-item" role="presentation">
                                                                    <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true"
                                                                        onClick={() => {
                                                                            setplanstatusD('Low');
                                                                            setInput('');
                                                                        }}>Low</button>
                                                                </li>
                                                                <li class="nav-item" role="presentation">
                                                                    <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false"
                                                                        onClick={() => {
                                                                            setplanstatusD('Medium');
                                                                            setInput('');
                                                                        }}>Medium</button>
                                                                </li>
                                                                <li class="nav-item" role="presentation">
                                                                    <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab"
                                                                        onClick={() => {
                                                                            setplanstatusD('High');
                                                                            setInput('');
                                                                        }} aria-controls="pills-contact" aria-selected="false">High</button>
                                                                </li>
                                                            </ul>
                                                            <div class="tab-content" id="pills-tabContent">
                                                                <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabindex="0">
                                                                    <div className='custom-plan-nav-tabs'>
                                                                        <div class="mb-3">
                                                                            <label for="exampleInputEmail1" class="form-label">₹ {planDetails.length > 0 ? planDetails[1].Low : 0}</label>
                                                                            <input value={input} min="0" type="number" class="form-control" id="exampleInputEmail1" onChange={(e) => { handleChange(e.target.value) }} aria-describedby="emailHelp" />
                                                                        </div>
                                                                        <div className='text-center'>
                                                                            <button className='dashboard-btn-1' onClick={() => { handleSubmit() }} >Submit</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabindex="0">
                                                                    <div className='custom-plan-nav-tabs'>
                                                                        <div class="mb-3">
                                                                            <label for="exampleInputEmail1" class="form-label">₹ {planDetails.length > 0 ? planDetails[1].Medium : 0}</label>
                                                                            <input value={input} min="0" type="number" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => { handleChange(e.target.value) }} />
                                                                        </div>
                                                                        <div className='text-center'>

                                                                            <button className='dashboard-btn-1' onClick={() => { handleSubmit() }} >Submit</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabindex="0">
                                                                    <div className='custom-plan-nav-tabs'>
                                                                        <div class="mb-3">
                                                                            <label for="exampleInputEmail1" class="form-label">₹ {planDetails.length > 0 ? planDetails[1].High : 0}</label>
                                                                            <input value={input} min="0" type="number" class="form-control" id="exampleInputEmail1" onChange={(e) => { handleChange(e.target.value) }} aria-describedby="emailHelp" />
                                                                        </div>
                                                                        <div className='text-center'>
                                                                            <button className='dashboard-btn-1' onClick={() => { handleSubmit() }} >Submit</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default Plan