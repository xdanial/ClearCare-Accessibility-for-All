import { useMemo, useState } from 'react'

const steps = ['Welcome', 'Service', 'Calendar', 'Information', 'Confirmation']

const services = [
  {
    id: 'general',
    category: 'General Medicine',
    description: 'Routine checkups, wellness visits, and common health concerns.',
    doctors: [
      {
        id: 'dr-williams',
        name: 'Dr. Maya Williams',
        specialty: 'Family Physician',
        bio: 'Gentle, clear communication with a focus on long-term wellness.',
        initials: 'MW',
      },
      {
        id: 'dr-clark',
        name: 'Dr. John Clark',
        specialty: 'Senior Care Specialist',
        bio: 'Helps older adults manage ongoing care with simple guidance.',
        initials: 'JC',
      },
    ],
  },
  {
    id: 'eye',
    category: 'Eye Exam',
    description: 'Vision checks, prescription updates, and eye health screenings.',
    doctors: [
      {
        id: 'dr-chen',
        name: 'Dr. Evelyn Chen',
        specialty: 'Optometrist',
        bio: 'Explains each exam step slowly and clearly for patient comfort.',
        initials: 'EC',
      },
      {
        id: 'dr-harris',
        name: 'Dr. Samuel Harris',
        specialty: 'Vision Care',
        bio: 'Experienced with age-related vision support and follow-up care.',
        initials: 'SH',
      },
    ],
  },
  {
    id: 'pharmacy',
    category: 'Pharmacy',
    description: 'Medication review, refills, and pharmacist consultations.',
    doctors: [
      {
        id: 'dr-rivera',
        name: 'Dr. Lina Rivera',
        specialty: 'Clinical Pharmacist',
        bio: 'Provides plain-language support for medication questions.',
        initials: 'LR',
      },
    ],
  },
]

const availability = {
  8: { morning: 'Available', afternoon: 'Available', evening: 'Full' },
  10: { morning: 'Full', afternoon: 'Available', evening: 'Available' },
  12: { morning: 'Available', afternoon: 'Full', evening: 'Available' },
  15: { morning: 'Available', afternoon: 'Available', evening: 'Available' },
  18: { morning: 'Full', afternoon: 'Available', evening: 'Full' },
  22: { morning: 'Available', afternoon: 'Available', evening: 'Full' },
  24: { morning: 'Available', afternoon: 'Full', evening: 'Available' },
  27: { morning: 'Full', afternoon: 'Available', evening: 'Available' },
}

const timeLabels = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
}

function getCalendarDays() {
  const year = 2026
  const month = 3
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []

  for (let i = 0; i < firstDay; i += 1) {
    cells.push(null)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(day)
  }

  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  return cells
}

function App() {
  const [step, setStep] = useState(0)
  const [search, setSearch] = useState('')
  const [selectedService, setSelectedService] = useState(services[0])
  const [selectedDoctor, setSelectedDoctor] = useState(services[0].doctors[0])
  const [selectedDay, setSelectedDay] = useState(8)
  const [selectedTime, setSelectedTime] = useState('morning')
  const [form, setForm] = useState({
    fullName: '',
    birthYear: '',
    phone: '',
    email: '',
    notes: '',
  })
  const [errors, setErrors] = useState({})

  const calendarDays = useMemo(() => getCalendarDays(), [])

  const filteredServices = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) return services

    return services
      .map((service) => ({
        ...service,
        doctors: service.doctors.filter(
          (doctor) =>
            doctor.name.toLowerCase().includes(term) ||
            doctor.specialty.toLowerCase().includes(term) ||
            service.category.toLowerCase().includes(term),
        ),
      }))
      .filter((service) => {
        return (
          service.category.toLowerCase().includes(term) ||
          service.doctors.length > 0
        )
      })
  }, [search])

  const selectedAvailability = availability[selectedDay] ?? {
    morning: 'Full',
    afternoon: 'Full',
    evening: 'Full',
  }

  const currentStepLabel = steps[step]

  function goNext() {
    if (step === 3 && !validateForm()) return
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0))
  }

  function chooseService(service) {
    setSelectedService(service)
    setSelectedDoctor(service.doctors[0])
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validateForm() {
    const nextErrors = {}

    if (!form.fullName.trim()) nextErrors.fullName = 'Please enter your full name.'
    if (!/^\d{4}$/.test(form.birthYear)) {
      nextErrors.birthYear = 'Please enter your birth year using 4 numbers.'
    }
    if (!/^[0-9+()\-\s]{10,}$/.test(form.phone)) {
      nextErrors.phone = 'Please enter a valid phone number.'
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function restartBooking() {
    setStep(0)
  }

  return (
    <div className="min-h-screen text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-10">
        <header className="mb-6 rounded-[2rem] border-4 border-brand-navy bg-white p-6 shadow-card">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-lg font-semibold uppercase tracking-[0.18em] text-brand-blue">
                ClearCare Scheduling
              </p>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight text-brand-navy sm:text-5xl">
                Simple healthcare appointment booking for older adults
              </h1>
              <p className="mt-3 max-w-2xl text-xl text-slate-700">
                Large text, clear labels, and one step at a time.
              </p>
            </div>
            <a
              href="tel:+18005551234"
              className="inline-flex items-center justify-center rounded-3xl border-4 border-brand-navy bg-brand-gold px-6 py-5 text-center text-2xl font-bold text-brand-navy transition hover:bg-yellow-300"
            >
              Call for Help: (800) 555-1234
            </a>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-lg font-semibold text-brand-navy">
              <span>Step {step + 1} of 5</span>
              <span>{currentStepLabel}</span>
            </div>
            <div className="h-5 overflow-hidden rounded-full border-2 border-brand-navy bg-slate-200">
              <div
                className="h-full rounded-full bg-brand-blue transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </header>

        <main className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[2rem] border-4 border-brand-navy bg-white p-6 shadow-card sm:p-8">
            {step === 0 && (
              <div className="space-y-8">
                <div className="rounded-[2rem] bg-brand-navy p-8 text-white">
                  <p className="text-lg font-semibold uppercase tracking-[0.15em] text-brand-gold">
                    Welcome
                  </p>
                  <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                    Book an appointment in five simple steps
                  </h2>
                  <p className="mt-4 max-w-2xl text-2xl leading-relaxed text-slate-100">
                    Press the large button below to begin. If you would rather speak with
                    someone, use the phone number above for one-click calling assistance.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    'Large high-contrast text',
                    'No pop-up windows or chat boxes',
                    'Clear written labels for every action',
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-3xl border-2 border-brand-blue bg-brand-sky px-5 py-6 text-xl font-semibold text-brand-navy"
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex min-h-20 w-full items-center justify-center rounded-[2rem] border-4 border-brand-navy bg-brand-gold px-6 py-5 text-3xl font-bold text-brand-navy transition hover:bg-yellow-300"
                >
                  Book an Appointment
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-brand-navy">Choose a service and doctor</h2>
                  <p className="mt-3 text-xl text-slate-700">
                    Use the quick search box to find a doctor name or specialty.
                  </p>
                </div>

                <label className="block">
                  <span className="mb-3 block text-xl font-semibold text-brand-navy">
                    Quick Search
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by doctor name or specialty"
                    className="field-input"
                  />
                </label>

                <div className="space-y-6">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className={`rounded-[2rem] border-4 p-5 ${
                        selectedService.id === service.id
                          ? 'border-brand-navy bg-brand-sky'
                          : 'border-slate-300 bg-slate-50'
                      }`}
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h3 className="text-3xl font-bold text-brand-navy">{service.category}</h3>
                          <p className="mt-2 max-w-2xl text-xl text-slate-700">
                            {service.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => chooseService(service)}
                          className="rounded-2xl border-4 border-brand-navy bg-white px-5 py-3 text-xl font-bold text-brand-navy transition hover:bg-brand-gold"
                        >
                          Select Service
                        </button>
                      </div>

                      <div className="mt-5 grid gap-4">
                        {service.doctors.map((doctor) => (
                          <button
                            key={doctor.id}
                            type="button"
                            onClick={() => {
                              chooseService(service)
                              setSelectedDoctor(doctor)
                            }}
                            className={`grid gap-4 rounded-[1.75rem] border-4 p-5 text-left transition md:grid-cols-[110px_minmax(0,1fr)_auto] md:items-center ${
                              selectedDoctor.id === doctor.id
                                ? 'border-brand-navy bg-white'
                                : 'border-slate-300 bg-slate-100 hover:border-brand-blue'
                            }`}
                          >
                            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-brand-navy bg-brand-gold text-3xl font-bold text-brand-navy">
                              {doctor.initials}
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-brand-navy">{doctor.name}</p>
                              <p className="text-xl font-semibold text-brand-blue">
                                {doctor.specialty}
                              </p>
                              <p className="mt-2 text-lg text-slate-700">{doctor.bio}</p>
                            </div>
                            <span className="rounded-2xl border-2 border-brand-navy px-4 py-2 text-lg font-semibold text-brand-navy">
                              {selectedDoctor.id === doctor.id ? 'Selected Doctor' : 'Choose Doctor'}
                            </span>
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
                <div>
                  <h2 className="text-4xl font-bold text-brand-navy">Pick a date and time</h2>
                  <p className="mt-3 text-xl text-slate-700">
                    Choose a day from the full-month calendar, then select Morning,
                    Afternoon, or Evening.
                  </p>
                </div>

                <div className="overflow-hidden rounded-[2rem] border-4 border-brand-navy">
                  <div className="grid grid-cols-7 bg-brand-navy text-center text-lg font-bold uppercase tracking-wide text-white">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="border border-slate-200 px-2 py-4">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 bg-white">
                    {calendarDays.map((day, index) => {
                      const dayAvailability = day ? availability[day] : null
                      const isSelected = day === selectedDay

                      return (
                        <button
                          key={`${day ?? 'empty'}-${index}`}
                          type="button"
                          disabled={!day}
                          onClick={() => day && setSelectedDay(day)}
                          className={`calendar-cell border p-3 text-left align-top transition ${
                            day
                              ? isSelected
                                ? 'border-brand-navy bg-brand-sky'
                                : 'border-slate-300 bg-white hover:bg-slate-50'
                              : 'border-slate-200 bg-slate-100'
                          }`}
                        >
                          {day && (
                            <>
                              <div className="text-2xl font-bold text-brand-navy">{day}</div>
                              <div className="mt-3 space-y-2 text-base font-semibold">
                                {dayAvailability ? (
                                  Object.entries(dayAvailability).map(([time, status]) => (
                                    <div
                                      key={time}
                                      className={`rounded-xl px-2 py-1 ${
                                        status === 'Available'
                                          ? 'bg-emerald-100 text-emerald-900'
                                          : 'bg-rose-100 text-rose-900'
                                      }`}
                                    >
                                      {timeLabels[time]}: {status}
                                    </div>
                                  ))
                                ) : (
                                  <div className="rounded-xl bg-slate-200 px-2 py-1 text-slate-700">
                                    No times listed
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {Object.entries(timeLabels).map(([value, label]) => {
                    const status = selectedAvailability[value]
                    const isSelected = selectedTime === value
                    const isDisabled = status !== 'Available'

                    return (
                      <button
                        key={value}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedTime(value)}
                        className={`rounded-[1.75rem] border-4 px-5 py-5 text-left transition ${
                          isDisabled
                            ? 'cursor-not-allowed border-slate-300 bg-slate-100 text-slate-500'
                            : isSelected
                              ? 'border-brand-navy bg-brand-gold text-brand-navy'
                              : 'border-brand-navy bg-white text-brand-navy hover:bg-brand-sky'
                        }`}
                      >
                        <p className="text-2xl font-bold">{label}</p>
                        <p className="mt-2 text-lg font-semibold">{status}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-brand-navy">Enter your information</h2>
                  <p className="mt-3 text-xl text-slate-700">
                    Please fill in one field at a time. Large input boxes are provided for easier
                    clicking and typing.
                  </p>
                </div>

                <form className="space-y-5">
                  <label className="block">
                    <span className="mb-3 block text-xl font-semibold text-brand-navy">Full Name</span>
                    <input
                      autoComplete="name"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleFormChange}
                      className="field-input"
                    />
                    {errors.fullName && (
                      <p className="mt-2 text-lg font-semibold text-red-700">{errors.fullName}</p>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-3 block text-xl font-semibold text-brand-navy">Birth Year</span>
                    <input
                      autoComplete="bday-year"
                      inputMode="numeric"
                      name="birthYear"
                      value={form.birthYear}
                      onChange={handleFormChange}
                      placeholder="Example: 1950"
                      className="field-input"
                    />
                    {errors.birthYear && (
                      <p className="mt-2 text-lg font-semibold text-red-700">{errors.birthYear}</p>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-3 block text-xl font-semibold text-brand-navy">Phone Number</span>
                    <input
                      autoComplete="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleFormChange}
                      className="field-input"
                    />
                    {errors.phone && (
                      <p className="mt-2 text-lg font-semibold text-red-700">{errors.phone}</p>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-3 block text-xl font-semibold text-brand-navy">Email Address</span>
                    <input
                      autoComplete="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      className="field-input"
                    />
                    {errors.email && (
                      <p className="mt-2 text-lg font-semibold text-red-700">{errors.email}</p>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-3 block text-xl font-semibold text-brand-navy">
                      Notes for the Clinic
                    </span>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleFormChange}
                      rows="4"
                      className="field-input"
                    />
                  </label>
                </form>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div className="rounded-[2rem] border-4 border-emerald-700 bg-emerald-50 p-8 text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-700 bg-white text-5xl font-bold text-emerald-700">
                    &#10003;
                  </div>
                  <h2 className="mt-5 text-5xl font-bold text-emerald-900">Success</h2>
                  <p className="mt-3 text-2xl text-emerald-900">
                    Your appointment request has been scheduled.
                  </p>
                </div>

                <div className="rounded-[2rem] border-4 border-brand-navy bg-brand-sky p-6">
                  <h3 className="text-3xl font-bold text-brand-navy">Appointment Summary</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      ['Date', `April ${selectedDay}, 2026`],
                      ['Time', timeLabels[selectedTime]],
                      ['Doctor', selectedDoctor.name],
                      ['Address', '125 Wellness Avenue, Suite 200'],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-white p-5">
                        <p className="text-lg font-semibold uppercase tracking-wide text-brand-blue">
                          {label}
                        </p>
                        <p className="mt-2 text-2xl font-bold text-brand-navy">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <button
                    type="button"
                    className="rounded-[1.75rem] border-4 border-brand-navy bg-white px-5 py-5 text-2xl font-bold text-brand-navy transition hover:bg-brand-sky"
                  >
                    Print Information
                  </button>
                  <button
                    type="button"
                    className="rounded-[1.75rem] border-4 border-brand-navy bg-brand-gold px-5 py-5 text-2xl font-bold text-brand-navy transition hover:bg-yellow-300"
                  >
                    Receive SMS Reminder
                  </button>
                  <button
                    type="button"
                    onClick={restartBooking}
                    className="rounded-[1.75rem] border-4 border-brand-navy bg-brand-navy px-5 py-5 text-2xl font-bold text-white transition hover:bg-brand-blue"
                  >
                    Book Another Visit
                  </button>
                </div>
              </div>
            )}

            {step > 0 && step < 4 && (
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-[1.75rem] border-4 border-brand-navy bg-white px-6 py-4 text-2xl font-bold text-brand-navy transition hover:bg-brand-sky"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-[1.75rem] border-4 border-brand-navy bg-brand-gold px-6 py-4 text-2xl font-bold text-brand-navy transition hover:bg-yellow-300"
                >
                  {step === 3 ? 'Confirm Appointment' : 'Continue'}
                </button>
              </div>
            )}
          </section>

          <aside className="rounded-[2rem] border-4 border-brand-navy bg-brand-navy p-6 text-white shadow-card">
            <h2 className="text-3xl font-bold">Your Booking</h2>
            <div className="mt-5 space-y-4">
              {[
                ['Service', selectedService.category],
                ['Doctor', selectedDoctor.name],
                ['Date', `April ${selectedDay}, 2026`],
                ['Time', timeLabels[selectedTime]],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/10 p-4">
                  <p className="text-lg font-semibold uppercase tracking-wide text-brand-gold">
                    {label}
                  </p>
                  <p className="mt-2 text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border-2 border-white/40 bg-white/10 p-4">
              <p className="text-xl font-bold">Instructions</p>
              <p className="mt-3 text-lg leading-relaxed text-slate-100">
                Follow each screen in order. Every button has a written label, and there are no
                hidden menus.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
