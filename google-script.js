function doGet(e) {
  const action = e.parameter.action;

  // ───────────── GET UCAPAN ─────────────
  if (action === 'getUcapan') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ucapan');
    const rows = sheet.getDataRange().getValues();

    // Sheet columns: A=timestamp, B=name, C=message, D=likes, E=id
    const wishes = rows.slice(1)
      .map(r => ({
        id:      String(r[4] || ''),
        name:    String(r[1] || ''),
        message: String(r[2] || ''),
        likes:   Number(r[3] || 0),
      }))
      .filter(w => w.name && w.message)
      .reverse();

    return json({ status: 'ok', wishes });
  }

  // ───────────── SAVE UCAPAN ─────────────
  if (action === 'saveUcapan') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ucapan');
    sheet.appendRow([
      new Date(),
      e.parameter.name || '',
      e.parameter.message || '',
      0,                          // likes starts at 0
      Utilities.getUuid(),        // unique id
    ]);
    return json({ status: 'ok' });
  }

  // ───────────── ADD LIKE ─────────────
  if (action === 'addLike') {
    const id = e.parameter.id;
    if (!id) return json({ status: 'error', message: 'Missing id' });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ucapan');
    const rows = sheet.getDataRange().getValues();

    // Find the row with matching id (column E, index 4)
    const rowIndex = rows.findIndex((r, i) => i > 0 && String(r[4]) === id);
    if (rowIndex === -1) return json({ status: 'error', message: 'Message not found' });

    const likesCell = sheet.getRange(rowIndex + 1, 4); // +1 because sheet rows are 1-based
    likesCell.setValue((Number(likesCell.getValue()) || 0) + 1);
    return json({ status: 'ok' });
  }

  // ───────────── GET GIFTS ─────────────
  if (action === 'getGifts') {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Gifts');
      const rows = sheet.getDataRange().getValues();
      const gifts = rows.slice(1).reverse().map(r => ({
        timestamp: r[0],
        name: String(r[1] || ''),
        gift: String(r[2] || ''),
      })).filter(g => g.name || g.gift);
      return json({ status: 'ok', gifts });
    } catch (err) {
      return json({ status: 'error', message: err.toString() });
    }
  }

  // ───────────── SAVE GIFT ─────────────
  if (action === 'saveGift') {
    try {
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Gifts');
      sheet.appendRow([new Date(), e.parameter.name || '', e.parameter.gift || '']);
      return json({ status: 'ok' });
    } catch (err) {
      return json({ status: 'error', message: err.toString() });
    }
  }

  // ───────────── SAVE RSVP ─────────────
  if (action === 'saveRSVP') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVP');
    sheet.appendRow([
      new Date(),
      e.parameter.name || '',
      e.parameter.phone || '',
      e.parameter.attendees || '1',
      e.parameter.ucapan || '',
    ]);
    return json({ status: 'ok' });
  }

  return json({ status: 'error', message: 'Unknown action' });
}

// helper
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
