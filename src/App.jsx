import { useMemo, useState } from 'react'

const steps = ['Welcome', 'Service', 'Calendar', 'Information', 'Confirmation']

const services = [
  {
    id: 'general',
    category: 'General Medicine',
    description: 'Routine checkups, wellness visits, and common health concerns.',
    doctors: [
      { id: 'dr-williams', name: 'Dr. Maya Williams', specialty: 'Family Physician', bio: 'Gentle, clear communication with a focus on long-term wellness.', initials: 'MW' },
      { id: 'dr-clark', name: 'Dr. John Clark', specialty: 'Senior Care Specialist', bio: 'Helps older adults manage ongoing care with simple guidance.', initials: 'JC' },
    ],
  },
  {
    id: 'eye',
    category: 'Eye Exam',
    description: 'Vision checks, prescription updates, and eye health screenings.',
    doctors: [
      { id: 'dr-chen', name: 'Dr. Evelyn Chen', specialty: 'Optometrist', bio: 'Explains each exam step slowly and clearly for patient comfort.', initials: 'EC' },
      { id: 'dr-harris', name: 'Dr. Samuel Harris', specialty: 'Vision Care', bio: 'Experienced with age-related vision support.', initials: 'SH' },
    ],
  },
  {
    id: 'pharmacy',
    category: 'Pharmacy',
    description: 'Medication review, refills, and pharmacist consultations.',
    doctors: [
      { id: 'dr-rivera', name: 'Dr. Lina Rivera', specialty: 'Clinical Pharmacist', bio: 'Provides plain-language support for medication questions.', initials: 'LR' },
    ],
  },
]

const availability = {
  8: { morning: 'Available', afternoon: 'Available', evening: 'Full' },
  10: { morning: 'Full', afternoon: 'Available', evening: 'Available' },
  15: { morning: 'Available', afternoon: 'Available', evening: 'Available' },
}

const timeLabels = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' }

function getCalendarDays() {
  const year = 2026; const month = 3;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function App() {
  // Session States
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState('patient') // 'patient' | 'admin'
  const [appointments, setAppointments] = useState([
    { id: 101, patient: 'John Doe', doctor: 'Dr. Maya Williams', date: 'April 10, 2026', time: 'Morning', status: 'Confirmed' }
  ])

  // Booking States
  const [step, setStep] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedService, setSelectedService] = useState(services[0])
  const [selectedDoctor, setSelectedDoctor] = useState(services[0].doctors[0])
  const [selectedDay, setSelectedDay] = useState(8)
  const [selectedTime, setSelectedTime] = useState('morning')
  const [form, setForm] = useState({ fullName: '', birthYear: '', phone: '', email: '', notes: '' })
  const [errors, setErrors] = useState({})

  const calendarDays = useMemo(() => getCalendarDays(), [])
  const currentStepLabel = steps[step]

  // Logic Functions
  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return services
    return services.map(s => ({
      ...s,
      doctors: s.doctors.filter(d => d.name.toLowerCase().includes(term) || s.category.toLowerCase().includes(term))
    })).filter(s => s.doctors.length > 0)
  }, [search])

  const selectedAvailability = availability[selectedDay] || { morning: 'Full', afternoon: 'Full', evening: 'Full' }

  const handleLogin = (role) => { setUserRole(role); setIsLoggedIn(true); setStep(0); }
  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const nextErrors = {}
    if (!form.fullName.trim()) nextErrors.fullName = 'Please enter your full name.'
    if (!/^\d{4}$/.test(form.birthYear)) nextErrors.birthYear = 'Please enter a valid 4-digit birth year.'
    if (!/^[0-9+()\-\s]{10,}$/.test(form.phone)) nextErrors.phone = 'Please enter a valid phone number.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const goNext = () => { if (step === 3 && !validateForm()) return; setStep(s => Math.min(s + 1, steps.length - 1)) }
  const goBack = () => setStep(s => Math.max(s - 1, 0))

  // --- LOGIN VIEW ---
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-sky p-4">
        <div className="bg-white p-12 rounded-[2rem] border-4 border-brand-navy shadow-card max-w-md w-full text-center">
          <h2 className="text-4xl font-bold text-brand-navy mb-8">ClearCare Access</h2>
          <button onClick={() => handleLogin('patient')} className="w-full bg-brand-gold text-brand-navy py-5 rounded-2xl text-2xl font-bold border-4 border-brand-navy mb-4 hover:bg-yellow-300 transition">
            Patient Login
          </button>
          <button onClick={() => handleLogin('admin')} className="w-full bg-brand-navy text-white py-5 rounded-2xl text-2xl font-bold hover:bg-brand-blue transition">
            Staff / Admin Login
          </button>
        </div>
      </div>
    )
  }

  // --- ADMIN VIEW ---
  if (userRole === 'admin') {
    return (
      <div className="p-10 bg-slate-100 min-h-screen">
        <header className="flex justify-between items-center mb-10 bg-brand-navy p-8 rounded-[2rem] text-white">
          <div><h1 className="text-3xl font-bold font-bold">Admin Dashboard</h1><p className="text-brand-gold">Health Service Management</p></div>
          <button onClick={() => setIsLoggedIn(false)} className="bg-white text-brand-navy px-8 py-3 rounded-xl font-bold border-2 border-white">Logout</button>
        </header>
        <div className="grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2 bg-white p-8 rounded-[2rem] border-4 border-brand-navy shadow-card">
            <h2 className="text-2xl font-bold mb-6 text-brand-navy">Daily Schedule (FR-9)</h2>
            {appointments.map(app => (
              <div key={app.id} className="border-b py-4 flex justify-between items-center">
                <div><p className="text-xl font-bold">{app.patient}</p><p className="text-slate-500">{app.doctor}</p></div>
                <div className="text-right font-bold"><p className="text-brand-blue">{app.time}</p><p className="text-sm text-emerald-600">{app.status}</p></div>
              </div>
            ))}
          </section>
          <section className="bg-brand-navy text-white p-8 rounded-[2rem] shadow-card flex flex-col justify-center text-center">
            <h2 className="text-2xl font-bold mb-4 text-brand-gold font-bold">Reporting (FR-10)</h2>
            <p className="text-7xl font-bold">{appointments.length}</p>
            <p className="text-xl mt-4">Total Appointments Today</p>
          </section>
        </div>
      </div>
    )
  }

  // --- PATIENT VIEW (FULL UI RESTORED) ---
  return (
    <div className="min-h-screen text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-10">
        <header className="mb-6 rounded-[2rem] border-4 border-brand-navy bg-white p-6 shadow-card">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-lg font-semibold uppercase tracking-[0.18em] text-brand-blue">ClearCare Scheduling</p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-brand-navy sm:text-5xl">Appointment Booking</h1>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="text-brand-blue underline text-xl font-bold">Switch User</button>
          </div>
          <div className="mt-8">
            <div className="flex justify-between font-bold text-xl mb-2"><span>Step {step + 1} of 5</span><span>{currentStepLabel}</span></div>
            <div className="h-5 bg-slate-200 rounded-full border-2 border-brand-navy overflow-hidden">
              <div className="h-full bg-brand-blue transition-all" style={{ width: `${((step + 1) / 5) * 100}%` }}></div>
            </div>
          </div>
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-[2rem] border-4 border-brand-navy bg-white p-8 shadow-card">
            {step === 0 && (
              <div className="space-y-8 text-center py-10">
                <div className="bg-brand-navy text-white p-8 rounded-[2rem] text-center">
                  <h2 className="text-5xl font-bold mb-4">Welcome to ClearCare</h2>
                  <p className="text-2xl text-slate-100">Simple healthcare appointment booking for older adults. Large text, clear labels, and one step at a time.</p>
                </div>
                <button onClick={goNext} className="w-full bg-brand-gold border-4 border-brand-navy py-6 rounded-[2rem] text-4xl font-bold transition hover:bg-yellow-300">Start Booking Now</button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-brand-navy">Choose a doctor</h2>
                <input type="text" placeholder="Search doctor or specialty..." className="w-full rounded-2xl border-2 border-brand-navy bg-white px-5 py-4 text-xl shadow-sm outline-none transition focus:ring-4 focus:ring-brand-sky" onChange={(e) => setSearch(e.target.value)} />
                <div className="space-y-6">
                  {filteredServices.map(service => (
                    <div key={service.id} className="p-6 border-4 border-slate-200 rounded-[2rem] bg-slate-50">
                      <h3 className="text-3xl font-bold mb-4 text-brand-navy">{service.category}</h3>
                      <div className="grid gap-4">
                        {service.doctors.map(doctor => (
                          <button key={doctor.id} onClick={() => {setSelectedService(service); setSelectedDoctor(doctor)}} className={`grid gap-4 rounded-[1.75rem] border-4 p-5 text-left transition md:grid-cols-[100px_1fr_auto] items-center ${selectedDoctor.id === doctor.id ? 'border-brand-navy bg-white shadow-lg' : 'border-slate-300 bg-slate-100'}`}>
                            <div className="h-20 w-20 flex items-center justify-center rounded-full bg-brand-gold text-3xl font-bold border-4 border-brand-navy">{doctor.initials}</div>
                            <div><p className="text-2xl font-bold">{doctor.name}</p><p className="text-xl text-brand-blue">{doctor.specialty}</p></div>
                            <span className="bg-brand-navy text-white px-6 py-2 rounded-xl font-bold">{selectedDoctor.id === doctor.id ? 'Selected' : 'Select'}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-brand-navy">Pick a date and time</h2>
                <div className="overflow-hidden rounded-[2rem] border-4 border-brand-navy bg-white">
                  <div className="grid grid-cols-7 bg-brand-navy text-white text-center py-4 font-bold text-xl">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}</div>
                  <div className="grid grid-cols-7 border-t border-brand-navy">
                    {calendarDays.map((d, i) => (
                      <button key={i} disabled={!d} onClick={() => setSelectedDay(d)} className={`h-32 border border-slate-200 p-4 text-left transition ${d ? (selectedDay === d ? 'bg-brand-sky' : 'hover:bg-slate-50') : 'bg-slate-100'}`}>
                        {d && <><span className="text-2xl font-bold">{d}</span><div className="mt-2 text-xs font-bold bg-emerald-100 text-emerald-800 p-1 rounded">Available</div></>}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(timeLabels).map(([key, val]) => (
                    <button key={key} onClick={() => setSelectedTime(key)} className={`p-6 border-4 rounded-2xl text-2xl font-bold transition ${selectedTime === key ? 'bg-brand-gold border-brand-navy' : 'border-slate-300'}`}>{val}</button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <h2 className="text-4xl font-bold text-brand-navy">Your Information</h2>
                <div className="space-y-6">
                  <label className="block text-2xl font-bold">Full Name <input name="fullName" className="w-full mt-2 p-5 border-4 border-brand-navy rounded-2xl" onChange={handleFormChange} /></label>
                  {errors.fullName && <p className="text-red-600 font-bold">{errors.fullName}</p>}
                  <label className="block text-2xl font-bold">Birth Year <input name="birthYear" placeholder="Example: 1950" className="w-full mt-2 p-5 border-4 border-brand-navy rounded-2xl" onChange={handleFormChange} /></label>
                  {errors.birthYear && <p className="text-red-600 font-bold">{errors.birthYear}</p>}
                  <label className="block text-2xl font-bold">Phone Number <input name="phone" className="w-full mt-2 p-5 border-4 border-brand-navy rounded-2xl" onChange={handleFormChange} /></label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-12 space-y-8">
                <div className="bg-emerald-50 border-4 border-emerald-600 p-10 rounded-[2rem]">
                  <h2 className="text-5xl font-bold text-emerald-800">Booking Confirmed!</h2>
                  <p className="text-2xl mt-4 text-emerald-900">Your visit with {selectedDoctor.name} has been successfully scheduled.</p>
                </div>
                <button onClick={() => setStep(0)} className="w-full bg-brand-navy text-white py-6 rounded-[2rem] text-3xl font-bold">Book Another Visit</button>
              </div>
            )}

            {step > 0 && step < 4 && (
              <div className="flex justify-between mt-12">
                <button onClick={goBack} className="border-4 border-brand-navy px-12 py-5 rounded-2xl text-2xl font-bold hover:bg-slate-50">Back</button>
                <button onClick={goNext} className="bg-brand-gold border-4 border-brand-navy px-12 py-5 rounded-2xl text-2xl font-bold hover:bg-yellow-300">Continue</button>
              </div>
            )}
          </section>

          <aside className="bg-brand-navy p-8 rounded-[2rem] text-white shadow-card">
            <h3 className="text-3xl font-bold mb-6 border-b-2 border-brand-gold pb-4">Booking Summary</h3>
            <div className="space-y-6">
              <div><p className="text-brand-gold font-bold text-lg uppercase">Doctor</p><p className="text-2xl font-bold">{selectedDoctor.name}</p></div>
              <div><p className="text-brand-gold font-bold text-lg uppercase">Service</p><p className="text-2xl font-bold">{selectedService.category}</p></div>
              <div><p className="text-brand-gold font-bold text-lg uppercase">Date</p><p className="text-2xl font-bold">April {selectedDay}, 2026</p></div>
              <div><p className="text-brand-gold font-bold text-lg uppercase">Time</p><p className="text-2xl font-bold">{timeLabels[selectedTime]}</p></div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
