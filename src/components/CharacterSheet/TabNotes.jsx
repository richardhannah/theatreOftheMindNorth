function TabNotes({ char, set }) {
  return (
    <div className="cs-section">
      <div className="cs-section-header">Notes</div>
      <div className="cs-notes-wrap">
        <textarea
          className="cs-notes"
          value={char.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Record any notes about your character here..."
        />
      </div>
    </div>
  )
}

export default TabNotes
