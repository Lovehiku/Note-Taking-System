import React from 'react'

function FormInput() {
  return (
    <div className='form-input'>
      <label>{label}</label>
        <input  type={type} 
                value={value} 
                onChange={onChange} 
                required={required} 
        />
        </div>
  )
}

export default FormInput