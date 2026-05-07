
const path = require('path');
process.chdir(path.dirname(__filename));
process.env.JWT_SECRET = 'smoke-test-secret';
process.env.PORT = '5099';

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

(async () => {
    const mem = await MongoMemoryServer.create({ binary: { version: '6.0.14' } });
    process.env.MONGO_URI_LOCAL = mem.getUri();
    console.log('mongo memory at', process.env.MONGO_URI_LOCAL);

    await mongoose.connect(process.env.MONGO_URI_LOCAL);
    const User = require('./models/user_info');
    await User.create({
        name: 'Admin', email: 'admin',
        password: await bcrypt.hash('admin', 10),
        phone: '0', gender: 'NA',
        birth: new Date('1990-01-01'),
        role: 'admin'
    });
    await User.create({
        name: 'Test User', email: 'user@test.com',
        password: await bcrypt.hash('pass', 10),
        phone: '1', gender: 'NA',
        birth: new Date('2000-01-01'),
        role: 'user'
    });

    require('./server');

    await new Promise(r => setTimeout(r, 1500));

    const base = `http://localhost:${process.env.PORT}`;
    const f = async (m, url, opts = {}) => {
        const r = await fetch(base + url, { method: m, ...opts });
        const text = await r.text();
        let body; try { body = JSON.parse(text); } catch { body = text; }
        return { status: r.status, body };
    };

    const log = (label, r) => {
        const ok = r.status < 400 ? 'PASS' : 'FAIL';
        console.log(`[${ok}] ${label} -> ${r.status}`,
            typeof r.body === 'object' ? JSON.stringify(r.body).slice(0, 200) : String(r.body).slice(0, 200));
        if (r.status >= 400) process.exitCode = 1;
    };

    let r = await f('POST', '/api/users/login', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin', password: 'admin' })
    });
    log('admin login', r);
    const token = r.body.token;
    const auth = { Authorization: `Bearer ${token}` };

    r = await f('POST', '/api/messages', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            senderName: 'Alice', senderEmail: 'alice@x.com',
            subject: 'Hello', body: 'Need help with my booking'
        })
    });
    log('user posts message', r);
    const msgId = r.body._id;

    r = await f('POST', '/api/contact-messages', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name: 'Bob', Email: 'bob@x.com', Message: 'Old form' })
    });
    log('user posts via legacy contact-messages', r);

    r = await f('GET', '/api/messages', { headers: auth });
    log('admin GET /messages', r);
    if (!Array.isArray(r.body) || r.body.length < 2) {
        console.log('   !! expected >=2 messages, got', Array.isArray(r.body) ? r.body.length : 'non-array');
        process.exitCode = 1;
    }

    r = await f('PUT', `/api/messages/${msgId}/read`, { headers: auth });
    log('admin marks read', r);


    r = await f('PUT', `/api/messages/${msgId}/reply`, {
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify({ adminReply: 'Hi Alice, looking into it.' })
    });
    log('admin replies', r);
    if (r.body.status !== 'replied') { console.log('   !! status not flipped to replied'); process.exitCode = 1; }


    r = await f('PUT', `/api/messages/${msgId}`, {
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify({ subject: 'Hello (edited)', body: 'Updated body text' })
    });
    log('admin edits message', r);
    if (r.body.subject !== 'Hello (edited)') { console.log('   !! edit not applied'); process.exitCode = 1; }

    r = await f('POST', '/api/messages/admin-send', {
        headers: { 'Content-Type': 'application/json', ...auth },
        body: JSON.stringify({
            recipientEmail: 'user@test.com',
            subject: 'Welcome',
            body: 'Hi! Thanks for joining Trip Kuwait.'
        })
    });
    log('admin sends new message to user', r);
    const sentId = r.body._id;
    if (r.body.direction !== 'out' || r.body.status !== 'sent') {
        console.log('   !! sent message not stored as direction=out, status=sent');
        process.exitCode = 1;
    }


    r = await f('PUT', `/api/messages/${msgId}/ignore`, { headers: auth });
    log('admin ignores message', r);

    r = await f('DELETE', `/api/messages/${sentId}`, { headers: auth });
    log('admin deletes message', r);

    let r2 = await f('POST', '/api/users/login', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@test.com', password: 'pass' })
    });
    const userToken = r2.body.token;
    r = await f('GET', '/api/messages', { headers: { Authorization: `Bearer ${userToken}` } });
    if (r.status === 403) {
        console.log('[PASS] non-admin blocked from /messages -> 403');
    } else {
        console.log('[FAIL] non-admin got', r.status);
        process.exitCode = 1;
    }


    await mongoose.disconnect();
    await mem.stop();
    console.log('\n--- smoke test done ---', process.exitCode ? 'WITH FAILURES' : 'all green');
    process.exit(process.exitCode || 0);
})().catch(e => { console.error('fatal', e); process.exit(1); });
