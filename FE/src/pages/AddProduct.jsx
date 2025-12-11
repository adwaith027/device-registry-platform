import React from "react";
import '../styles/AddProduct.css'

export default function AddProduct(){
    return(
        <div className="add-product-page">
            <div className="add-product-page__header">
                <h2 className="add-product-page__title">Management</h2>
            </div>

            <div className="add-product-card">
                <form className="add-product-form">

                    <div className="add-product-form__field">
                        <label htmlFor="customercode" className="add-product-form__label">
                            Customer Code
                        </label>
                        <input
                            type="text"
                            id="customercode"
                            name="customercode"
                            className="add-product-form__input"
                            placeholder="Customer Code"
                            required
                        />
                    </div>

                    <div className="add-product-form__field">
                        <label htmlFor="serialnumber" className="add-product-form__label">
                            Serial Number
                        </label>
                        <input
                            type="text"
                            id="serialnumber"
                            name="serialnumber"
                            className="add-product-form__input"
                            placeholder="Serial Number"
                            required
                        />
                    </div>

                    <div className="add-product-form__field">
                        <label htmlFor="customername" className="add-product-form__label">
                            Customer Name
                        </label>
                        <input
                            type="text"
                            id="customername"
                            name="customername"
                            className="add-product-form__input"
                            placeholder="Customer Name"
                            required
                        />
                    </div>

                    <div className="add-product-form__field">
                        <label htmlFor="phonenumber" className="add-product-form__label">
                            Phone Number
                        </label>
                        <input
                            type="text"
                            id="phonenumber"
                            name="phonenumber"
                            className="add-product-form__input"
                            placeholder="Phone Number"
                            required
                        />
                    </div>

                    <div className="add-product-form__field">
                        <label htmlFor="licenseurl" className="add-product-form__label">
                            License URL
                        </label>
                        <input
                            type="text"
                            id="licenseurl"
                            name="licenseurl"
                            className="add-product-form__input"
                            placeholder="License URL"
                            required
                        />
                    </div>

                    <div className="add-product-form__field">
                        <label htmlFor="uid" className="add-product-form__label">
                            UID
                        </label>
                        <input
                            type="text"
                            id="uid"
                            name="uid"
                            className="add-product-form__input"
                            placeholder="UID"
                            required
                        />
                    </div>

                    <button type="submit" className="add-product-form__submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}