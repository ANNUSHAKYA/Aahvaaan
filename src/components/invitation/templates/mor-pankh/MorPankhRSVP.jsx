import React, { useState } from 'react';
import { User, Phone, Check, Heart, Sparkles, AlertCircle } from 'lucide-react';
import { MorPankhFeather } from './MorPankhArt';

export default function MorPankhRSVP({
  events = [],
  coupleName = 'Aarav & Meera',
  invitationId = 'mor-pankh',
  guestName = 'Mr. Joshi and Family',
}) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [attendanceStatus, setAttendanceStatus] = useState('attending'); // 'attending' | 'decline' | 'tentative'
  const [attendance, setAttendance] = useState({});
  const [diet, setDiet] = useState('vegetarian');
  const [wishes, setWishes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [validationError, setValidationError] = useState('');

  const celebrationEvents = events.length > 0 ? events : [
    { name: 'Ring Ceremony', date: '25 Feb 2027' },
    { name: 'Haldi', date: '26 Feb 2027' },
    { name: 'Mehendi', date: '26 Feb 2027' },
    { name: 'Sangeet', date: '26 Feb 2027' },
    { name: 'Vivaah', date: '27 Feb 2027' },
    { name: 'Reception', date: '27 Feb 2027' },
  ];

  const handleAttendanceChange = (eventName, status) => {
    setAttendance((prev) => ({
      ...prev,
      [eventName]: status,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    const cleanMobile = (mobile || '').replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      setValidationError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Persist & Deduplicate by phone in storage
    try {
      const key = `aahvaaan_rsvps_${invitationId || 'common'}`;
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      const idx = stored.findIndex((r) => r.phone === cleanMobile);
      const entry = {
        name: name.trim(),
        phone: cleanMobile,
        guestCount,
        attendance,
        diet,
        wishes: wishes.trim(),
        updatedAt: new Date().toISOString(),
      };
      if (idx >= 0) {
        stored[idx] = { ...stored[idx], ...entry };
        setIsUpdate(true);
      } else {
        stored.push({ ...entry, createdAt: new Date().toISOString() });
        setIsUpdate(false);
      }
      localStorage.setItem(key, JSON.stringify(stored));
    } catch {
      // ignore
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-12 px-6 bg-[radial-gradient(ellipse_at_top,#fffdf5,#FAF6F0)] rounded-3xl border-2 border-[#C9A24B] shadow-2xl max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#0E4D4F] text-[#FAF6F0] flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-md">
          ♥
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#082D2E] mb-2">
          {isUpdate ? `Welcome back, ${name}!` : `Thank you, ${name}!`}
        </h3>
        <p className="font-body text-xs sm:text-sm text-[#57534e] max-w-sm mx-auto leading-relaxed mb-6">
          {isUpdate
            ? 'Your RSVP response has been successfully updated. The host family will see your latest answer.'
            : `Your response has been recorded for ${coupleName}'s wedding celebrations. We can't wait to welcome you!`}
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs text-[#0E4D4F] hover:text-[#C9A24B] underline font-semibold transition-colors"
        >
          Update response again
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/95 backdrop-blur-md rounded-3xl border-2 border-[#C9A24B]/60 shadow-2xl p-6 sm:p-10 max-w-2xl mx-auto text-left"
    >
      {/* Title */}
      <div className="text-center mb-6">
        <MorPankhFeather className="h-16 w-14 mx-auto mb-1 text-[#C9A24B]" />
        <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-[#C9A24B] block mb-1">
          The celebration is incomplete without you
        </span>
        <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#082D2E] mb-2">
          Will you join us?
        </h3>
        <p className="font-body text-xs sm:text-sm text-[#57534e]">
          Kindly share your wishes by 1 February 2027. We can't wait to celebrate with you.
        </p>
      </div>

      <p className="mb-6 border-y border-[#C9A24B]/30 py-2.5 text-center text-xs text-[#0E4D4F]">
        Personally invited: <span className="font-semibold">{guestName}</span>
      </p>

      {/* Attendance Status Selector */}
      <div className="mb-6">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0E4D4F] mb-2">
          Your Attendance
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'attending', label: 'Joyfully attending ✨' },
            { id: 'tentative', label: 'Tentative 🤔' },
            { id: 'decline', label: 'Regretfully decline' },
          ].map((status) => (
            <button
              type="button"
              key={status.id}
              onClick={() => setAttendanceStatus(status.id)}
              className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                attendanceStatus === status.id
                  ? 'bg-[#0E4D4F] text-[#FAF6F0] border-[#0E4D4F] shadow-sm font-semibold'
                  : 'bg-[#FAF6F0]/60 text-[#57534e] border-[#C9A24B]/30 hover:bg-white'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {validationError && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Row: Name and Mobile Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0E4D4F] mb-1.5">
            Your name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#57534e]">
              <User size={16} />
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full pl-10 pr-3 py-2.5 bg-[#FAF6F0]/60 border border-[#C9A24B]/40 rounded-xl text-xs sm:text-sm text-[#082D2E] focus:outline-hidden focus:border-[#0E4D4F] focus:ring-1 focus:ring-[#0E4D4F] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0E4D4F] mb-1.5">
            10-digit mobile number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#57534e]">
              <Phone size={16} />
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 9876543210"
              className="w-full pl-10 pr-3 py-2.5 bg-[#FAF6F0]/60 border border-[#C9A24B]/40 rounded-xl text-xs sm:text-sm text-[#082D2E] focus:outline-hidden focus:border-[#0E4D4F] focus:ring-1 focus:ring-[#0E4D4F] transition-all"
            />
          </div>
          <span className="text-[10px] text-[#57534e] mt-1 block">
            Reply again from this number any time to update your answer.
          </span>
        </div>
      </div>

      {/* Guest Counter: How many of you are coming? */}
      <div className="mb-8 p-5 bg-[#FAF6F0]/70 rounded-2xl border border-[#C9A24B]/40 text-center">
        <label className="block text-xs sm:text-sm font-serif font-bold text-[#082D2E] mb-1">
          How many of you are coming?
        </label>
        <p className="text-[10px] text-[#57534e] mb-4">
          Counts for every event you say Yes or Maybe to, below. Up to 10 people.
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
            className="w-9 h-9 rounded-full bg-white border border-[#C9A24B] text-[#0E4D4F] font-bold text-lg hover:bg-[#FAF6F0] shadow-xs active:scale-95 transition-all"
          >
            -
          </button>
          <span className="font-serif text-2xl font-bold text-[#082D2E] w-10 text-center">
            {guestCount}
          </span>
          <button
            type="button"
            onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
            className="w-9 h-9 rounded-full bg-white border border-[#C9A24B] text-[#0E4D4F] font-bold text-lg hover:bg-[#FAF6F0] shadow-xs active:scale-95 transition-all"
          >
            +
          </button>
        </div>
      </div>

      {/* Event Schedule Checkboxes / Radio Options */}
      <div className="mb-8">
        <div className="mb-4">
          <h4 className="font-serif text-base font-bold text-[#082D2E]">
            Event Schedule
          </h4>
          <p className="text-xs text-[#57534e]">
            Let us know which events you'll be joining.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {celebrationEvents.map((evt, idx) => {
            const currentChoice = attendance[evt.name] || 'yes';
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-[#C9A24B]/30 bg-white shadow-2xs hover:border-[#C9A24B] transition-colors"
              >
                <div className="mb-2">
                  <span className="font-serif font-bold text-sm text-[#082D2E] block">
                    {evt.name}
                  </span>
                  <span className="text-[10px] text-[#57534e] font-medium">
                    📅 {evt.date}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-black/5">
                  {['Yes', 'Maybe', 'No'].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-1.5 text-xs text-[#57534e] cursor-pointer hover:text-[#082D2E]"
                    >
                      <input
                        type="radio"
                        name={`evt_${evt.name}`}
                        value={opt.toLowerCase()}
                        checked={currentChoice === opt.toLowerCase()}
                        onChange={() => handleAttendanceChange(evt.name, opt.toLowerCase())}
                        className="text-[#0E4D4F] focus:ring-[#0E4D4F]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dietary Preferences */}
      <div className="mb-6">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0E4D4F] mb-2">
          Dietary Preference
        </label>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'vegetarian', label: 'Vegetarian 🥦' },
            { id: 'jain', label: 'Jain Special 🪷' },
            { id: 'non-veg', label: 'Non-Vegetarian 🍗' },
          ].map((item) => (
            <label
              key={item.id}
              className={`px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all ${
                diet === item.id
                  ? 'bg-[#0E4D4F] text-[#FAF6F0] border-[#0E4D4F] shadow-xs'
                  : 'bg-[#FAF6F0] text-[#57534e] border-[#C9A24B]/40 hover:bg-white'
              }`}
            >
              <input
                type="radio"
                name="dietPreference"
                value={item.id}
                checked={diet === item.id}
                onChange={() => setDiet(item.id)}
                className="sr-only"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Wishes Message Box */}
      <div className="mb-6">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#0E4D4F] mb-1.5">
          Leave the couple a wish (optional)
        </label>
        <textarea
          rows={3}
          value={wishes}
          onChange={(e) => setWishes(e.target.value)}
          placeholder="Write your blessings and heartfelt wishes here..."
          className="w-full p-3 bg-[#FAF6F0]/60 border border-[#C9A24B]/40 rounded-xl text-xs sm:text-sm text-[#082D2E] focus:outline-hidden focus:border-[#0E4D4F] focus:ring-1 focus:ring-[#0E4D4F] transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3.5 px-6 rounded-2xl bg-[#0E4D4F] text-[#FAF6F0] font-serif text-sm sm:text-base font-bold shadow-lg hover:bg-[#082D2E] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <Heart size={16} className="text-[#C9A24B] fill-[#C9A24B]" />
        <span>Send RSVP</span>
      </button>

      <span className="block text-center text-[10px] text-[#57534e]/70 mt-3">
        Your response will be recorded directly for the wedding host family.
      </span>
    </form>
  );
}
