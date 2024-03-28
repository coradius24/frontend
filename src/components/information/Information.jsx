"use client";
import { useState } from "react";
import Input from "../input/Input";
import "./information.css";

const Information = () => {
  const [data, setData] = useState({
    name: "",
    father_name: "",
    mother_name: "",
    personal_mobile_no: "",
    home_number: "",
    education_background: "",
    idNumber: "",
  });
  const [idType, setSelectedId] = useState("nid");

  const {
    name,
    father_name,
    mother_name,
    personal_mobile_no,
    home_number,
    education_background,
    idNumber,
  } = data;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    // toto actual login
  };

  return (
    <div className="mt-3 student-registration-form">
      <div className="form-container">
        <h2 className="mb-4">Student Registration Form</h2>
        <form onSubmit={submitHandler}>
          <Input
            value={name}
            onChangeHandler={onChangeHandler}
            label={"Student Name"}
            name={"name"}
            required
          />
          <Input
            value={father_name}
            onChangeHandler={onChangeHandler}
            label={"Father Name:"}
            name={"father_name"}
            required
          />
          <Input
            value={mother_name}
            onChangeHandler={onChangeHandler}
            label={"Mother Name:"}
            name={"mother_name"}
            required
          />
          <Input
            value={personal_mobile_no}
            onChangeHandler={onChangeHandler}
            label={"Personal Mobile No:"}
            name={"personal_mobile_no"}
            type={"number"}
            required
          />
          <Input
            value={home_number}
            onChangeHandler={onChangeHandler}
            label={"Home Number:"}
            type={"number"}
            name={"home_number"}
            required
          />
          <Input
            value={education_background}
            onChangeHandler={onChangeHandler}
            label={"Education Background:"}
            name={"education_background"}
            required
          />
          <div className="form-group">
            <label htmlFor="id_type">ID Type:</label>
            <select
              defaultValue={idType}
              name="id_type"
              required=""
              onChange={(e) => setSelectedId(e.target.value)}
            >
              <option value="nid">NID</option>
              <option value="passport">Passport</option>
              <option value="bc">Birth Certificate</option>
            </select>
          </div>
          <Input
            value={idNumber}
            onChangeHandler={onChangeHandler}
            label={"ID Number:"}
            name={"id_number"}
            required
          />
          <div className="form-group">
            <label htmlFor="document">Upload Your Document:</label>
            <input type="file" name="document" required="" />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Information;
