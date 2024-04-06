import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NetworkError, showError, showMessage } from "./ToastMessage";
import getBase from "./Api";
import { ToastContainer } from "react-toastify";
import { useCookies } from 'react-cookie';

export default function DoctorLogin() {
  let [cookies, setCookie, removeCookie] = useCookies(['theeasylearn']);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let navigate = useNavigate();

  let doctorLogin = function(event) {
    event.preventDefault();
    console.log(email, password);

    let apiAdrress = getBase() + "doctor_login.php";
    console.log(apiAdrress);

    let form = new FormData();
    form.append("email", email);
    form.append("password", password);

    axios({
      method: 'post',
      responseType:'json',
      url: apiAdrress,
      data: form
    }).then((response) => {
      console.log(response.data);
      let error = response.data[0]['error'];
      if (error !== 'no'){
        showError(error);
      }
      else {
        let success = response.data[1]['success'];
        let message = response.data[2]['message'];
        if (success !== 'yes'){
          showError(message);
        }
        else {
          showMessage(message);
          let doctorid = response.data[3]['id'];
          setCookie("doctorid",doctorid);
          console.log("doctor id =",cookies['doctorid']);
          setTimeout(() => {
            navigate("/admin-appointments/" + doctorid);
          },2000);
        }
      }
    }).catch((error) => {
      NetworkError(error);  
    });
  }
    return(<main>
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <ToastContainer />
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-5 col-12 d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex justify-content-center py-2">
                    <p className="d-flex align-items-center w-auto">
                      <img src="../logo.png" height="50px" />
                      <span className="d-none d-lg-block h4">Online Doctor Appointment</span>
                    </p>
                  </div>
                  {/* End Logo */}
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">Doctor Login</h5>
                      </div>
                      <form className="row g-3 needs-validation" onSubmit={doctorLogin}>
                        <div className="col-12">
                          <label htmlFor="youremail" className="form-label">Email</label>
                          <div className="input-group has-validation">
                            <span className="input-group-text" id="inputGroupPrepend">@</span>
                            <input type="email" name="email" className="form-control" id="youremail" 
                            value={email} onChange={(event) => setEmail(event.target.value)} required />
                            <div className="invalid-feedback">Please enter your username.</div>
                          </div>
                        </div>
                        <div className="col-12">
                          <label htmlFor="yourPassword" className="form-label">Password</label>
                          <input type="password" name="password" className="form-control" id="yourPassword" 
                          value={password} onChange={(event) => setPassword(event.target.value)} required />
                          <div className="invalid-feedback">Please enter your password!</div>
                          <div className="mt-1">
                            <a href="doctor-forgot.html">Forgot password?</a>
                          </div>
                        </div>
                        <div className="col-12">
                          <button className="btn btn-primary w-100" type="submit">Login</button>
                        </div>
                        <div className="col-12">
                          <p className="small mb-0">Don't have account? <Link to='/doctor-login'>Create an account</Link></p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>      
      );
}