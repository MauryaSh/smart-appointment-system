import { useState,useEffect } from "react";
import Calendar from "react-calendar";
import api from "../../utils/api";
import "react-calendar/dist/Calendar.css";

export default function SPCalendar(){

  const [date,setDate] = useState(new Date())
  const [slots,setSlots] = useState([])

  const serviceId = localStorage.getItem("selectedService")

  const getSlots = async()=>{

    const res = await api.get(`/slots/generate/${serviceId}`
    )

    setSlots(res.data)

  }

  useEffect(()=>{
    if(serviceId){
      getSlots()
    }
  },[])

  return(

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-4">
        Booking Calendar
      </h2>

      <Calendar
        onChange={setDate}
        value={date}
      />

      <div className="grid grid-cols-4 gap-3 mt-6">

        {slots.map((slot,i)=>(
          <div
            key={i}
            className="border p-2 rounded text-center bg-gray-50"
          >
            {slot.start} - {slot.end}
          </div>
        ))}

      </div>

    </div>

  )
}