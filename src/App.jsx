import { useMemo, useState } from 'react'

const steps = ['Welcome', 'Service', 'Calendar', 'Information', 'Confirmation']

const services = [
  {
    id: 'general',
    category: 'General Medicine',
    description: 'Routine checkups, wellness visits, and common health concerns.',
    doctors: [
      { id: 'dr-williams', name: 'Dr. Maya Williams', specialty: 'Family Physician', bio: 'Gentle, clear communication.', initials: 'MW' },
      { id: 'dr-clark', name: 'Dr. John Clark', specialty: 'Senior Care Specialist', bio: 'Helps older adults manage care.', initials: 'JC' },
    ],
  },
  {
    id: 'eye',
    category: 'Eye Exam',
    description: 'Vision checks, prescription updates, and eye health screenings.',
    doctors: [
      { id: 'dr-chen', name: 'Dr. Evelyn Chen', specialty: 'Optometrist', bio: 'Explains each exam step slowly.', initials: 'EC' },
      { id: 'dr-harris', name: 'Dr. Samuel Harris', specialty: 'Vision Care', bio: 'Experienced with age-related vision support.', initials: 'SH' },
    ],
  },
  {
    id: 'pharmacy',
    category: 'Pharmacy',
    description: 'Medication review, refills, and pharmacist consultations.',
    doctors: [
      { id: 'dr-rivera', name: 'Dr. Lina Rivera', specialty: 'Clinical Pharmacist', bio: 'Provides plain-language support.', initials: 'LR' },
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
  const [userRole, setUserRole] = useState('patient')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [appointments, setAppointments] = useState([
    { id: 101, patient: 'John Doe', doctor: 'Dr. Maya Williams', date: 'April 10, 2026', time: 'Morning', status: 'Confirmed' }
  ])

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

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return services
    return services.map(s => ({
      ...s,
      doctors: s.doctors.filter(d => d.name.toLowerCase().includes(term) || s.category.toLowerCase().includes(term))
    })).filter(s => s.doctors.length > 0)
  }, [search])

  const selectedAvailability = availability[selectedDay] || { morning: 'Full', afternoon: 'Full', evening: 'Full' }

  const goNext = () => { if (step === 3 && !validateForm()) return; setStep(s => Math.min(s + 1, steps.length - 1)) }
  const goBack = () => setStep(s => Math.max(s - 1, 0))
  const chooseService = (s) => { setSelectedService(s); setSelectedDoctor(s.doctors[0]) }
  const restartBooking = () => { setStep(0); setIsLoggedIn(false) }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.fullName.trim()) newErrors.fullName = 'Name required'
    if (!/^\d{4}$/.test(form.birthYear)) newErrors.birthYear = 'Enter 4 digits'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-sky">
        <div className="bg-white p-10 rounded-[2rem] border-4 border-brand-navy shadow-card max-w-md w-full">
          <h2 className="text-3xl font-bold text-brand-navy mb-6 text-center">ClearCare Login</h2>
          <button onClick={() => setIsLoggedIn(true)} className="w-full bg-brand-gold text-brand-navy py-4 rounded-2xl text-xl font-bold border-4 border-brand-navy mb-4">Login as Patient</button>
          <button onClick={() => {setUserRole('admin'); setIsLoggedIn(true)}} className="w-full bg-brand-navy text-white py-4 rounded-2xl text-xl font-bold">Login as Administrator</button>
        </div>
      </div>
    )
  }

  if (isLoggedIn && userRole === 'admin') {
    return (
      <div className="p-10 bg-slate-100 min-h-screen">
        <header className="flex justify-between items-center mb-10 bg-brand-navy p-6 rounded-2xl text-white">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={() => setIsLoggedIn(false)} className="bg-red-500 px-4 py-2 rounded-lg font-bold">Logout</button>
        </header>
        <div className="grid gap-6 md:grid-cols-2">
          <section className="bg-white p-6 rounded-2xl shadow-card border-4 border-brand-navy">
            <h2 className="text-2xl font-bold mb-4">Daily Schedule</h2>
            {appointments.map(app => (
              <div key={app.id} className="border-b py-2 flex justify-between">
                <span>{app.patient} - {app.doctor}</span>
                <span className="font-bold text-brand-blue">{app.time}</span>
              </div>
            ))}
          </section>
          <section className="bg-white p-6 rounded-2xl shadow-card border-4 border-brand-navy text-center">
            <h2 className="text-2xl font-bold mb-4">Reports</h2>
            <p className="text-4xl font-bold text-brand-navy">{appointments.length} Bookings Today</p>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-10">
        <header className="mb-6 rounded-[2rem] border-4 border-brand-navy bg-white p-6 shadow-card">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-lg font-semibold uppercase tracking-[0.18em] text-brand-blue">ClearCare Scheduling</p>
              <h1 className="text-4xl font-bold text-brand-navy">Healthcare Booking</h1>
            </div>
            <button onClick={() => setIsLoggedIn(false)} className="text-brand-blue underline font-bold">Change User</button>
          </div>
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between font-bold">
              <span>Step {step + 1} of 5</span>
              <span>{currentStepLabel}</span>
            </div>
            <div className="h-4 bg-slate-200 rounded-full border-2 border-brand-navy overflow-hidden">
              <div className="h-full bg-brand-blue transition-all" style={{ width: `${((step + 1) / 5) * 100}%` }}></div>
            </div>
          </div>
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-[2rem] border-4 border-brand-navy bg-white p-6 shadow-card">
            {step === 0 && (
              <div className="text-center py-10">
                <h2 className="text-4xl font-bold mb-6">Welcome to ClearCare</h2>
                <button onClick={goNext} className="bg-brand-gold border-4 border-brand-navy px-10 py-5 rounded-2xl text-3xl font-bold transition hover:scale-105">Start Booking</button>
              </div>
            )}
            
            {}
            {step > 0 && step < 4 && (
              <div className="flex justify-between mt-10">
                <button onClick={goBack} className="border-4 border-brand-navy px-8 py-3 rounded-xl font-bold">Back</button>
                <button onClick={goNext} className="bg-brand-gold border-4 border-brand-navy px-8 py-3 rounded-xl font-bold">Continue</button>
              </div>
            )}
          </section>

          <aside className="bg-brand-navy p-6 rounded-[2rem] text-white">
            <h3 className="text-2xl font-bold mb-4">Summary</h3>
            <p>Doctor: {selectedDoctor.name}</p>
            <p>Service: {selectedService.category}</p>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
