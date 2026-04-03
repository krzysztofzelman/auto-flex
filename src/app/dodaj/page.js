'use client'
import { useState } from 'react'
import { supabase } from '@/supabase'
import { useRouter } from 'next/navigation'

export default function DodajAuto() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.target)
    
    const { error } = await supabase.from('cars').insert([{
      brand: formData.get('brand'),
      model: formData.get('model'),
      price: parseInt(formData.get('price')),
      year: parseInt(formData.get('year')),
      description: formData.get('description'),
    }])

    if (!error) {
      router.push('/') 
      router.refresh() 
    } else {
      alert('Błąd: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dodaj nowe ogłoszenie</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input name="brand" placeholder="Marka" required />
        <input name="model" placeholder="Model" required />
        <input name="price" type="number" placeholder="Cena" required />
        <input name="year" type="number" placeholder="Rocznik" required />
        <textarea name="description" placeholder="Opis" />
        <button type="submit" disabled={loading}>
          {loading ? 'Dodawanie...' : 'Dodaj ogłoszenie'}
        </button>
      </form>
    </div>
  )
}