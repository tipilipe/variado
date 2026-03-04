import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp, getDocs, setDoc, query, where, writeBatch, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const { useState, useEffect, useMemo, useCallback, Fragment, useRef } = React;

// --- Configuração Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyB4_j-nrEmdlFUj-6UzPbEXWh9KzIVhzv4",
    authDomain: "familia-51e40.firebaseapp.com",
    projectId: "familia-51e40",
    storageBucket: "familia-51e40.firebasestorage.app",
    messagingSenderId: "840839866248",
    appId: "1:840839866248:web:59ba4a1fe9cbf903c33c3d",
    measurementId: "G-5K3H7V3Q72"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'familia-51e40';

const VERSION = "4.177";

// --- Design System ---
const UI_SIZES = {
    sm: { id: 'sm', label: 'Compacto', textBase: 'text-[9px] md:text-[10px]', textLg: 'text-[10px] md:text-xs', textXl: 'text-xs md:text-sm', text2xl: 'text-sm md:text-base', inputPad: 'p-1.5', btnPad: 'p-2', cardPad: 'p-3', gap: 'gap-2', icon: 'w-2.5 h-2.5', iconLg: 'w-3 h-3', radius: 'rounded-md', headerPad: 'p-2', colGap: 'gap-4', gridCols: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-4' },
    md: { id: 'md', label: 'Padrão', textBase: 'text-xs md:text-sm', textLg: 'text-base md:text-lg', textXl: 'text-xl md:text-2xl', text2xl: 'text-2xl md:text-3xl', inputPad: 'p-3', btnPad: 'p-3.5', cardPad: 'p-5', gap: 'gap-6', icon: 'w-4 h-4', iconLg: 'w-5 h-5', radius: 'rounded-xl', headerPad: 'p-4', colGap: 'gap-8', gridCols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' },
    lg: { id: 'lg', label: 'Grande', textBase: 'text-sm md:text-base', textLg: 'text-lg md:text-xl', textXl: 'text-2xl md:text-3xl', text2xl: 'text-3xl md:text-4xl', inputPad: 'p-4', btnPad: 'p-5', cardPad: 'p-6', gap: 'gap-8', icon: 'w-5 h-5', iconLg: 'w-6 h-6', radius: 'rounded-2xl', headerPad: 'p-5', colGap: 'gap-10', gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' },
    xl: { id: 'xl', label: 'Extra', textBase: 'text-base md:text-lg', textLg: 'text-xl md:text-2xl', textXl: 'text-3xl md:text-4xl', text2xl: 'text-4xl md:text-5xl', inputPad: 'p-5', btnPad: 'p-6', cardPad: 'p-8', gap: 'gap-10', icon: 'w-6 h-6', iconLg: 'w-8 h-8', radius: 'rounded-3xl', headerPad: 'p-6', colGap: 'gap-12', gridCols: 'grid-cols-1 md:grid-cols-2' }
};

const Icon = ({ name, className = "" }) => {
    const icons = {
        wallet: <path d="M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 12a2 2 0 000 4h4v-4z" />,
        plus: <path d="M12 5v14M5 12h14" />,
        trash: <g><path d="M3 6h18" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></g>,
        calendar: <g><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M16 2v4M8 2v4M3 10h18" /></g>,
        pencil: <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />,
        check: <path d="M20 6L9 17l-5-5" />,
        circle: <circle cx="12" cy="12" r="10" />,
        search: <g><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></g>,
        logout: <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />,
        left: <path d="M15 18l-6-6 6-6" />,
        right: <path d="M9 18l6-6-6-6" />,
        download: <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />,
        repeat: <g><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 014-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 01-4 4H3" /></g>,
        x: <path d="M18 6L6 18M6 6l12 12" />,
        grid: <g><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></g>,
        layout: <g><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></g>,
        layer: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {icons[name] || null}
        </svg>
    );
};

const ActionModal = ({ isOpen, title, onClose, onOptionOne, onOptionTwo, textOne, textTwo, ui }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay p-4">
            <div className={`bg-white ${ui.radius} ${ui.cardPad} w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200`}>
                <h3 className={`${ui.textBase} font-bold uppercase tracking-widest text-slate-900 mb-6 text-center`}>{title}</h3>
                <div className={`flex flex-col ${ui.gap}`}>
                    <button onClick={onOptionOne} className={`w-full ${ui.btnPad} bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold uppercase ${ui.textBase} tracking-widest ${ui.radius} transition-all`}>{textOne}</button>
                    <button onClick={onOptionTwo} className={`w-full ${ui.btnPad} bg-slate-900 text-white font-bold uppercase ${ui.textBase} tracking-widest ${ui.radius} hover:bg-slate-800 transition-all`}>{textTwo}</button>
                </div>
                <button onClick={onClose} className={`w-full mt-4 text-center ${ui.textBase} font-bold text-slate-400 uppercase tracking-widest`}>Cancelar</button>
            </div>
        </div>
    );
};

function App() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [groups, setGroups] = useState([]);

    const [uiSize, setUiSize] = useState(() => localStorage.getItem('uiSize') || 'md');
    const ui = UI_SIZES[uiSize];

    const [editingId, setEditingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const descriptionInputRef = useRef(null);

    const [showEditStrategy, setShowEditStrategy] = useState(false);
    const [showDeleteStrategy, setShowDeleteStrategy] = useState(false);

    const [loginInput, setLoginInput] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [currentWorkMonth, setCurrentWorkMonth] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('month');
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    // Estado inicial com data segura (string YYYY-MM-DD)
    const getTodayString = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState({
        description: '', amount: '', type: 'expense', category: 'GERAL', accountGroup: 'GERAL',
        date: getTodayString(), isPaid: false,
        isRecurring: false, recurringMonths: 1
    });

    const [newGroupName, setNewGroupName] = useState('');
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);

    const changeUiSize = (size) => {
        setUiSize(size);
        localStorage.setItem('uiSize', size);
    };

    // CORREÇÃO: Formatação de Data Segura para Exibição (Ignora Fuso Horário)
    const formatDateDisplay = (dateString) => {
        if (!dateString) return "-";
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            if (u) { setUser(u); setLoading(false); }
            else { signInAnonymously(auth).catch(() => setLoading(false)); }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user || !isAuthorized || !profile) return;
        const userKey = profile.username.trim().toLowerCase();
        console.log('INIT - Profile username:', profile.username);
        console.log('INIT - UserKey (minúsculo):', userKey);

        const txPath = collection(db, 'artifacts', appId, 'users', userKey, 'transactions');
        const unsubTx = onSnapshot(txPath, (snap) => {
            setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        const grPath = collection(db, 'artifacts', appId, 'users', userKey, 'groups');
        const unsubGr = onSnapshot(grPath, (snap) => {
            const loadedGroups = snap.docs.map(d => d.data().name);
            const defaults = ['GERAL', 'CASA', 'PESSOAL', 'TRANSPORTE'];
            const merged = [...new Set([...defaults, ...loadedGroups])];
            setGroups(merged);
        });

        return () => { unsubTx(); unsubGr(); };
    }, [user, isAuthorized, profile]);

    const handleDescriptionChange = (e) => setFormData({ ...formData, description: e.target.value.toUpperCase() });

    const handleAmountChange = (e) => {
        let val = e.target.value.replace(/\D/g, "");
        if (!val) { setFormData({ ...formData, amount: "" }); return; }
        const floatVal = (parseFloat(val) / 100).toFixed(2);
        setFormData({ ...formData, amount: floatVal });
    };

    const formatCurrencyDisplay = (val) => {
        if (!val) return "";
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(val);
    };

    // CORREÇÃO: Comparação de datas usando partes da string para evitar fuso horário
    const totals = useMemo(() => {
        const m = currentWorkMonth.getMonth();
        const y = currentWorkMonth.getFullYear();

        return transactions.reduce((acc, curr) => {
            if (!curr.date) return acc;
            const [tYear, tMonth, tDay] = curr.date.split('-').map(Number);

            // tMonth - 1 porque no objeto Date o mês é 0-11, mas na string é 01-12
            const isSame = (tMonth - 1) === m && tYear === y;
            const val = parseFloat(curr.amount) || 0;

            if (isSame) {
                if (curr.type === 'income') { acc.income += val; acc.balance += val; }
                else {
                    acc.expense += val; acc.balance -= val;
                    if (curr.isPaid) acc.paid += val; else acc.pending += val;
                }
            }
            return acc;
        }, { income: 0, expense: 0, balance: 0, paid: 0, pending: 0 });
    }, [transactions, currentWorkMonth]);

    const nextTwelveMonths = useMemo(() => {
        const months = []; const now = new Date();
        for (let i = 0; i < 12; i++) { months.push(new Date(now.getFullYear(), now.getMonth() + i, 1)); }
        return months;
    }, []);

    const getDaysInMonth = useCallback((date) => {
        const year = date.getFullYear(); const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= totalDays; i++) days.push(new Date(year, month, i));
        return days;
    }, []);

    const groupedList = useMemo(() => {
        const m = currentWorkMonth.getMonth(); const y = currentWorkMonth.getFullYear();
        let res = [...transactions];

        // Filtro Mês Seguro
        if (filterType !== 'all') {
            res = res.filter(t => {
                if (!t.date) return false;
                const [tYear, tMonth, tDay] = t.date.split('-').map(Number);
                const isSame = (tMonth - 1) === m && tYear === y;

                if (filterType === 'pending') return isSame && !t.isPaid && t.type === 'expense';
                if (filterType === 'paid') return isSame && t.isPaid;
                return isSame;
            });
        }

        if (searchTerm) res = res.filter(t => t.description.toLowerCase().includes(searchTerm.toLowerCase()));
        res.sort((a, b) => b.date.localeCompare(a.date)); // Ordenação descendente (mais recente primeiro)

        const groupsObj = {};
        res.forEach(t => {
            const gName = t.accountGroup || 'GERAL';
            if (!groupsObj[gName]) groupsObj[gName] = { items: [], total: 0 };
            groupsObj[gName].items.push(t);
            if (t.type === 'expense') groupsObj[gName].total -= t.amount;
            else groupsObj[gName].total += t.amount;
        });

        return groupsObj;
    }, [transactions, currentWorkMonth, filterType, searchTerm]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginInput.username === 'Filipe' && loginInput.password === 'LMA@123456') { setIsAuthorized(true); setProfile({ username: 'Filipe' }); }
        else { setLoginError('Credenciais incorretas.'); }
    };

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) return;
        const userKey = profile.username.trim().toLowerCase();
        await addDoc(collection(db, 'artifacts', appId, 'users', userKey, 'groups'), { name: newGroupName.toUpperCase(), createdAt: serverTimestamp() });
        setFormData({ ...formData, accountGroup: newGroupName.toUpperCase() });
        setNewGroupName('');
        setIsCreatingGroup(false);
    };

    const handlePreSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            // Busca o item original para saber se é recorrente
            const item = transactions.find(t => t.id === editingId);
            if (!item) {
                alert('Erro: item não encontrado.');
                return;
            }
            if (item.recurringGroupId) {
                // Mostra modal para perguntar: só este ou este e futuros
                setShowEditStrategy(true);
            } else {
                // Item normal — edita direto
                processSubmit('single');
            }
        } else {
            // Novo lançamento
            processSubmit('new');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setShowEditStrategy(false);
        setFormData(prev => ({
            description: '',
            amount: '',
            type: 'expense',
            category: prev.category || 'GERAL',
            accountGroup: prev.accountGroup || 'GERAL',
            date: prev.date || getTodayString(),
            isPaid: false,
            isRecurring: false,
            recurringMonths: 1
        }));
    };

    // Campos seguros para atualizar em um item (exclui campos de criação de recorrência)
    const buildUpdatePayload = (floatAmount) => ({
        description: formData.description,
        amount: floatAmount,
        type: formData.type,
        category: formData.category || 'GERAL',
        accountGroup: formData.accountGroup || 'GERAL',
        date: formData.date,
        isPaid: formData.isPaid || false,
        updatedAt: serverTimestamp()
    });

    // mode: 'new' | 'single' | 'only_this' | 'this_and_future'
    const processSubmit = async (mode = 'new') => {
        if (!user || !profile || !formData.description || !formData.amount) return;
        const floatAmount = parseFloat(formData.amount);
        if (isNaN(floatAmount) || floatAmount <= 0) { alert('Valor inválido.'); return; }
        const userKey = profile.username.trim().toLowerCase();
        const colPath = collection(db, 'artifacts', appId, 'users', userKey, 'transactions');

        try {
            if (mode === 'single') {
                // ── Edição de item não-recorrente ────────────────────────────────
                await updateDoc(doc(colPath, editingId), buildUpdatePayload(floatAmount));

            } else if (mode === 'only_this') {
                // ── Editar apenas esta parcela recorrente ────────────────────────
                const payload = buildUpdatePayload(floatAmount);
                if (formData.isRecurring) {
                    payload.recurringTotal = Math.min(parseInt(formData.recurringMonths, 10) || 1, 48);
                }
                await updateDoc(doc(colPath, editingId), payload);

            } else if (mode === 'this_and_future') {
                // ── Editar esta e todas as futuras do grupo ──────────────────────
                const currentItem = transactions.find(t => t.id === editingId);
                if (!currentItem) { alert('Erro: item não encontrado.'); return; }

                const related = transactions.filter(t =>
                    t.recurringGroupId === currentItem.recurringGroupId &&
                    t.date >= currentItem.date
                );

                const allInGroup = transactions.filter(t =>
                    t.recurringGroupId === currentItem.recurringGroupId
                );

                const [, , formD] = formData.date.split('-').map(Number);
                const batch = writeBatch(db);
                const newTotal = Math.min(parseInt(formData.recurringMonths, 10) || 1, 48);

                // 1. Atualizar itens existentes na série (esta e futuras)
                related.forEach(item => {
                    const ref = doc(colPath, item.id);
                    const [origY, origM] = item.date.split('-').map(Number);
                    const daysInOrigMonth = new Date(origY, origM, 0).getDate();
                    const safeDay = Math.min(formD, daysInOrigMonth);
                    const newDateStr = `${origY}-${String(origM).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;

                    batch.update(ref, {
                        description: formData.description,
                        amount: floatAmount,
                        type: formData.type,
                        category: formData.category || 'GERAL',
                        accountGroup: formData.accountGroup || 'GERAL',
                        date: newDateStr,
                        recurringTotal: newTotal,
                        updatedAt: serverTimestamp()
                    });
                });

                // 2. Atualizar o total nas passadas (que não foram editadas na descrição/valor)
                allInGroup.forEach(item => {
                    const isFutureOrCurrent = related.some(r => r.id === item.id);
                    if (!isFutureOrCurrent) {
                        batch.update(doc(colPath, item.id), { recurringTotal: newTotal });
                    }
                });

                // 3. Adicionar novas parcelas se o total aumentou
                const maxCurrentIdx = allInGroup.reduce((max, t) => Math.max(max, t.recurringIndex || 0), 0);
                if (newTotal > maxCurrentIdx) {
                    const lastItem = allInGroup.reduce((a, b) => ((a.recurringIndex || 0) > (b.recurringIndex || 0) ? a : b), currentItem);
                    const [lastY, lastM] = lastItem.date.split('-').map(Number);

                    for (let i = maxCurrentIdx + 1; i <= newTotal; i++) {
                        let targetMonth = lastM + (i - (lastItem.recurringIndex || 0));
                        let targetYear = lastY;
                        while (targetMonth > 12) { targetMonth -= 12; targetYear++; }

                        const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
                        const safeDay = Math.min(formD, daysInMonth);
                        const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;

                        const newRef = doc(colPath);
                        batch.set(newRef, {
                            description: formData.description,
                            amount: floatAmount,
                            type: formData.type,
                            category: formData.category || 'GERAL',
                            accountGroup: formData.accountGroup || 'GERAL',
                            date: dateStr,
                            isPaid: false,
                            isRecurring: true,
                            recurringGroupId: currentItem.recurringGroupId,
                            recurringIndex: i,
                            recurringTotal: newTotal,
                            createdAt: serverTimestamp()
                        });
                    }
                }

                // 4. Remover parcelas excedentes se o total diminuiu
                if (newTotal < maxCurrentIdx) {
                    allInGroup.forEach(item => {
                        if ((item.recurringIndex || 0) > newTotal) {
                            batch.delete(doc(colPath, item.id));
                        }
                    });
                }

                await batch.commit();

            } else {
                // ── Novo lançamento ──────────────────────────────────────────────
                if (formData.isRecurring) {
                    const gid = `rec_${Date.now()}`;
                    const count = Math.min(parseInt(formData.recurringMonths, 10) || 1, 48);
                    const [startY, startM, startD] = formData.date.split('-').map(Number);
                    const batch = writeBatch(db);

                    for (let i = 0; i < count; i++) {
                        let targetMonth = startM + i;
                        let targetYear = startY;
                        while (targetMonth > 12) { targetMonth -= 12; targetYear++; }

                        const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
                        const safeDay = Math.min(startD, daysInMonth);
                        const dateStr = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;

                        const newRef = doc(colPath);
                        batch.set(newRef, {
                            description: formData.description,
                            amount: floatAmount,
                            type: formData.type,
                            category: formData.category || 'GERAL',
                            accountGroup: formData.accountGroup || 'GERAL',
                            date: dateStr,
                            isPaid: false,
                            isRecurring: true,
                            recurringGroupId: gid,
                            recurringIndex: i + 1,
                            recurringTotal: count,
                            createdAt: serverTimestamp()
                        });
                    }
                    await batch.commit();
                } else {
                    await addDoc(colPath, {
                        description: formData.description,
                        amount: floatAmount,
                        type: formData.type,
                        category: formData.category || 'GERAL',
                        accountGroup: formData.accountGroup || 'GERAL',
                        date: formData.date,
                        isPaid: formData.isPaid || false,
                        isRecurring: false,
                        createdAt: serverTimestamp()
                    });
                }
            }

            // Limpa estado após qualquer operação bem-sucedida
            setEditingId(null);
            setShowEditStrategy(false);
            setFormData(prev => ({
                description: '',
                amount: '',
                type: 'expense',
                category: 'GERAL',
                accountGroup: prev.accountGroup || 'GERAL',
                date: prev.date || getTodayString(),
                isPaid: false,
                isRecurring: false,
                recurringMonths: 1
            }));

            setStatusMessage('SALVO');
            setIsTransactionModalOpen(false);
            setTimeout(() => setStatusMessage(''), 2500);
            if (descriptionInputRef.current) descriptionInputRef.current.focus();

        } catch (err) { console.error('Erro ao salvar:', err); alert('Erro ao salvar: ' + err.message); }
    };

    const handleDeleteClick = (t) => {
        if (t.recurringGroupId) {
            setDeletingId(t.id);
            setShowDeleteStrategy(true);
        } else {
            if (confirm('Apagar permanentemente?')) deleteItem(t.id, false).catch(() => { });
        }
    };

    const deleteItem = async (id, deleteFuture) => {
        try {
            const userKey = profile.username.trim().toLowerCase();
            console.log('DELETE - Username original:', profile.username);
            console.log('DELETE - UserKey (minúsculo):', userKey);

            const colPath = collection(db, 'artifacts', appId, 'users', userKey, 'transactions');

            console.log('DELETE - ID:', id, 'DeleteFuture:', deleteFuture);

            if (deleteFuture) {
                const currentItem = transactions.find(t => t.id === id);
                console.log('DELETE - CurrentItem:', currentItem);

                if (!currentItem) {
                    alert('Erro: Transação não encontrada');
                    return;
                }

                const related = transactions.filter(t =>
                    t.recurringGroupId === currentItem.recurringGroupId &&
                    t.date >= currentItem.date
                );
                console.log('DELETE - Relacionadas:', related.length);
                console.log('DELETE - IDs a deletar:', related.map(r => r.id));

                const batch = writeBatch(db);
                related.forEach(item => {
                    console.log('DELETE - Deletando ID:', item.id);
                    batch.delete(doc(colPath, item.id));
                });

                const result = await batch.commit();
                console.log('DELETE - Batch Commit Result:', result);
                console.log('DELETE - Sucesso (Futuras)');
            } else {
                console.log('DELETE - Deletando uma transação ID:', id);
                const result = await deleteDoc(doc(colPath, id));
                console.log('DELETE - Delete Result:', result);
                console.log('DELETE - Sucesso (Uma)');
            }

            setShowDeleteStrategy(false);
            setDeletingId(null);
            setStatusMessage('DELETADO');
            setTimeout(() => setStatusMessage(''), 2500);
        } catch (err) {
            console.error('ERRO DELETE completo:', err);
            console.error('Código:', err.code);
            console.error('Mensagem:', err.message);
            alert('Erro ao deletar: ' + err.message);
            setShowDeleteStrategy(false);
            setDeletingId(null);
        }
    };

    const handleAuthAction = async (e) => {
        e.preventDefault();
        setLoginError('');
        const userKey = loginInput.username.trim().toLowerCase();
        if (!userKey) return;
        const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'userProfiles', userKey);
        try {
            if (isRegisterMode) {
                const docSnap = await getDoc(profileRef);
                if (docSnap.exists()) { setLoginError('Utilizador já cadastrado.'); return; }
                await setDoc(profileRef, { username: loginInput.username.trim(), password: loginInput.password, createdAt: serverTimestamp() });
                setProfile({ username: loginInput.username.trim() }); setIsAuthorized(true);
            } else {
                if (loginInput.username === 'Filipe' && loginInput.password === 'LMA@123456') { setProfile({ username: 'Filipe' }); setIsAuthorized(true); return; }
                const snap = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'userProfiles'));
                const match = snap.docs.find(d => d.id === userKey && d.data().password === loginInput.password);
                if (match) { setProfile({ username: match.data().username }); setIsAuthorized(true); } else { setLoginError('Credenciais incorretas.'); }
            }
        } catch (err) { setLoginError('Erro de ligação ao servidor.'); }
    };

    const exportData = (format, range) => {
        let list = [...transactions];
        if (range === 'month') {
            const m = currentWorkMonth.getMonth(); const y = currentWorkMonth.getFullYear();
            list = list.filter(t => {
                const [tYear, tMonth] = t.date.split('-').map(Number);
                return (tMonth - 1) === m && tYear === y;
            });
        }
        const headers = "Grupo,Descricao,Data,Valor,Tipo,Status\n";
        const body = list.map(t => `"${t.accountGroup || 'Geral'}","${t.description}",${t.date},${t.amount},${t.type},${t.isPaid ? 'Pago' : 'Pendente'}`).join("\n");
        const blob = new Blob([headers + body], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `relatorio_${profile.username}.csv`; a.click();
    };

    const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    if (loading) return <div className="h-screen flex items-center justify-center text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">Iniciando...</div>;

    if (!isAuthorized) return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100 font-sans text-slate-800">
            <div className="bg-white p-10 md:p-16 rounded shadow-sm w-full max-w-lg border border-slate-200">
                <div className="text-center mb-12">
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 uppercase">MY FINANCIAL FLOW</h1>
                    <p className="text-slate-400 text-xs uppercase mt-2 tracking-widest font-semibold">{isRegisterMode ? 'Nova Conta' : 'Login Seguro'}</p>
                </div>
                <form onSubmit={handleAuthAction} className="space-y-8">
                    <input type="text" required placeholder="Usuário" className="w-full p-5 bg-slate-50 border-none outline-none focus:ring-1 focus:ring-slate-300 text-lg" onChange={e => setLoginInput({ ...loginInput, username: e.target.value })} />
                    <input type="password" required placeholder="Senha" className="w-full p-5 bg-slate-50 text-lg border-none focus:ring-1 focus:ring-slate-300" onChange={e => setLoginInput({ ...loginInput, password: e.target.value })} />
                    {loginError && <p className="text-red-600 text-center text-sm font-bold">{loginError}</p>}
                    <button type="submit" className="w-full p-6 bg-slate-900 text-white font-bold uppercase text-sm tracking-widest hover:bg-slate-800 transition-all">
                        {isRegisterMode ? 'Criar Conta' : 'Entrar'}
                    </button>
                    <button type="button" onClick={() => setIsRegisterMode(!isRegisterMode)} className="w-full text-xs font-bold text-slate-400 uppercase tracking-widest pt-4 hover:text-slate-700">
                        {isRegisterMode ? 'Voltar para Login' : 'Criar Novo Usuário'}
                    </button>
                </form>
            </div>
        </div>
    );

    const isEditingRecurring = editingId && transactions.find(t => t.id === editingId)?.recurringGroupId;

    return (
        <div className={`max-w-[1600px] mx-auto p-4 ${ui.id === 'sm' ? 'md:p-4' : 'md:p-12'} ${ui.colGap} min-h-screen bg-slate-50 font-sans text-slate-700`}>
            <ActionModal isOpen={showEditStrategy} title="Editar Recorrência" onClose={() => { setShowEditStrategy(false); }} textOne="Apenas Esta" onOptionOne={() => processSubmit('only_this')} textTwo="Esta e Futuras" onOptionTwo={() => processSubmit('this_and_future')} ui={ui} />
            <ActionModal isOpen={showDeleteStrategy} title="Apagar Recorrência" onClose={() => { setShowDeleteStrategy(false); setDeletingId(null); }} textOne="Apenas Esta" onOptionOne={() => deleteItem(deletingId, false).catch(() => { })} textTwo="Esta e Futuras" onOptionTwo={() => deleteItem(deletingId, true).catch(() => { })} ui={ui} />

            {/* BOTÃO FLUTUANTE (MOBILE) / HEADER (DESKTOP) */}
            <div className="fixed bottom-6 right-6 z-40 lg:hidden">
                <button
                    onClick={() => { handleCancelEdit(); setIsTransactionModalOpen(true); }}
                    className="w-16 h-16 bg-slate-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                >
                    <Icon name="plus" className="w-8 h-8" />
                </button>
            </div>

            <header className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
                <div className="flex items-center gap-6">
                    <div className={`${ui.cardPad} bg-slate-900 rounded text-white shadow-md`}><Icon name="wallet" className={ui.iconLg} /></div>
                    <div>
                        <h1 className={`${ui.text2xl} font-black tracking-tight text-slate-900 uppercase`}>MY FINANCIAL FLOW</h1>
                        <span className={`text-slate-400 ${ui.textBase} font-bold uppercase tracking-widest flex items-center gap-3 mt-1`}>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            {profile?.username}
                        </span>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={() => { handleCancelEdit(); setIsTransactionModalOpen(true); }}
                        className={`hidden lg:flex items-center gap-3 px-6 ${ui.btnPad} bg-slate-900 text-white font-bold uppercase ${ui.textBase} tracking-widest rounded-full hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-0.5`}
                    >
                        <Icon name="plus" className={ui.icon} />
                        Lançar Despesa
                    </button>

                    <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-sm gap-1">
                        {Object.keys(UI_SIZES).map(key => (
                            <button
                                key={key}
                                onClick={() => changeUiSize(key)}
                                className={`w-8 h-8 flex items-center justify-center rounded text-[10px] font-bold uppercase transition-all ${uiSize === key ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'}`}
                                title={`Tamanho ${UI_SIZES[key].label}`}
                            >
                                {key.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <div className={`flex items-center bg-white ${ui.inputPad} rounded border border-slate-200 shadow-sm`}>
                        <button onClick={() => setCurrentWorkMonth(new Date(currentWorkMonth.getFullYear(), currentWorkMonth.getMonth() - 1, 1))} className={`${ui.btnPad} text-slate-400 hover:text-slate-900 ${ui.icon}`}><Icon name="left" className={ui.icon} /></button>
                        <div className="px-6 text-center min-w-[140px]">
                            <span className={`font-bold uppercase ${ui.textBase} text-slate-700 tracking-widest`}>{currentWorkMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                        </div>
                        <button onClick={() => setCurrentWorkMonth(new Date(currentWorkMonth.getFullYear(), currentWorkMonth.getMonth() + 1, 1))} className={`${ui.btnPad} text-slate-400 hover:text-slate-900 ${ui.icon}`}><Icon name="right" className={ui.icon} /></button>
                    </div>

                    <div className="flex flex-col items-center">
                        <button onClick={() => setIsAuthorized(false)} className={`px-6 ${ui.btnPad} text-slate-400 hover:text-red-700 ${ui.textBase} font-bold uppercase tracking-widest flex items-center gap-2 border border-transparent hover:bg-white rounded transition-all`}>
                            <Icon name="logout" className={ui.icon} /> Sair
                        </button>
                        <span className="text-[8px] font-black text-slate-300 mt-1 uppercase tracking-widest opacity-60">v.{VERSION}</span>
                    </div>
                </div>
            </header>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${ui.gap} mb-12`}>
                {[
                    { label: 'Saldo Mensal', value: totals.balance, color: totals.balance >= 0 ? 'text-slate-900' : 'text-red-600' },
                    { label: 'Receitas Totais', value: totals.income, color: 'text-emerald-600' },
                    { label: 'Pendentes', value: totals.pending, color: 'text-red-600' },
                    { label: 'Liquidados', value: totals.paid, color: 'text-slate-400' }
                ].map((card, i) => (
                    <div key={i} className={`bg-white ${ui.cardPad} ${ui.radius} border border-slate-200 shadow-sm transition-all hover:shadow-md hover:bg-white/80 overflow-hidden flex flex-col justify-between min-h-[120px]`}>
                        <span className={`${ui.textBase} font-bold text-slate-400 uppercase tracking-widest`}>{card.label}</span>
                        <div className={`font-bold mt-2 break-words leading-tight ${card.color} ${ui.text2xl}`}>
                            {formatBRL(card.value)}
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE LANÇAMENTO */}
            {isTransactionModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`bg-white ${ui.radius} shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300`}>
                        <div className="p-6 bg-slate-900 flex justify-between items-center text-white">
                            <h2 className={`${ui.textBase} font-bold uppercase tracking-[0.3em]`}>{editingId ? "Editar Lançamento" : "Novo Lançamento"}</h2>
                            <button onClick={() => { setIsTransactionModalOpen(false); handleCancelEdit(); }} className="hover:rotate-90 transition-all p-2 opacity-60 hover:opacity-100">
                                <Icon name="x" className="w-6 h-6" />
                            </button>
                        </div>

                        <div className={`p-8 ${ui.gap} max-h-[85vh] overflow-y-auto`}>
                            <form onSubmit={(e) => { e.preventDefault(); handlePreSubmit(e); }} className="space-y-6">
                                <div>
                                    <label className={`${ui.textBase} font-bold text-slate-400 uppercase tracking-widest`}>Descrição</label>
                                    <input
                                        ref={descriptionInputRef}
                                        type="text"
                                        required
                                        placeholder="EX: ALUGUEL"
                                        className={`w-full mt-2 ${ui.inputPad} bg-slate-50 border-none ${ui.textLg} font-medium outline-none focus:ring-1 focus:ring-slate-300 rounded`}
                                        value={formData.description}
                                        onChange={handleDescriptionChange}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`${ui.textBase} font-bold text-slate-400 uppercase tracking-widest`}>Montante (R$)</label>
                                        <input type="text" required placeholder="0,00" className={`w-full mt-2 ${ui.inputPad} bg-slate-50 border-none ${ui.textXl} font-bold text-slate-900 outline-none rounded`} value={formatCurrencyDisplay(formData.amount)} onChange={handleAmountChange} />
                                    </div>
                                    <div>
                                        <label className={`${ui.textBase} font-bold text-slate-400 uppercase tracking-widest`}>Data</label>
                                        <input type="date" className={`w-full mt-2 ${ui.inputPad} bg-slate-50 border-none ${ui.textBase} font-bold outline-none rounded`} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`${ui.textBase} font-bold text-slate-400 uppercase tracking-widest`}>Grupo</label>
                                        <div className="flex gap-2 mt-2">
                                            {!isCreatingGroup ? (
                                                <Fragment>
                                                    <select className={`w-full ${ui.inputPad} bg-slate-50 border-none ${ui.textBase} font-bold uppercase cursor-pointer rounded`} value={formData.accountGroup} onChange={e => setFormData({ ...formData, accountGroup: e.target.value })}>
                                                        {groups.map(g => <option key={g} value={g}>{g}</option>)}
                                                    </select>
                                                    <button type="button" onClick={() => setIsCreatingGroup(true)} className={`${ui.btnPad} bg-slate-900 text-white rounded hover:bg-slate-800`}><Icon name="plus" className={ui.icon} /></button>
                                                </Fragment>
                                            ) : (
                                                <Fragment>
                                                    <input type="text" autoFocus placeholder="NOVO GRUPO..." className={`w-full ${ui.inputPad} bg-slate-50 border-none ${ui.textBase} font-bold uppercase rounded`} value={newGroupName} onChange={e => setNewGroupName(e.target.value.toUpperCase())} />
                                                    <button type="button" onClick={handleCreateGroup} className={`${ui.btnPad} bg-emerald-600 text-white rounded hover:bg-emerald-700`}><Icon name="check" className={ui.icon} /></button>
                                                    <button type="button" onClick={() => setIsCreatingGroup(false)} className={`${ui.btnPad} bg-slate-200 text-slate-600 rounded hover:bg-slate-300`}><Icon name="x" className={ui.icon} /></button>
                                                </Fragment>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className={`${ui.textBase} font-bold text-slate-400 uppercase tracking-widest`}>Tipo</label>
                                        <select className={`w-full mt-2 ${ui.inputPad} bg-slate-50 border-none ${ui.textBase} font-bold uppercase outline-none rounded`} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                            <option value="expense">Despesa</option>
                                            <option value="income">Receita</option>
                                        </select>
                                    </div>
                                </div>

                                {editingId && !formData.isRecurring ? (
                                    <div className="p-4 rounded border text-center bg-blue-50 border-blue-200">
                                        <p className={`${ui.textBase} font-bold uppercase tracking-widest text-blue-700`}>
                                            Editando Transação Única
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-50 rounded">
                                        <label className="flex items-center gap-4 cursor-pointer group">
                                            <input type="checkbox" className="w-5 h-5 text-slate-900 rounded border-slate-300 focus:ring-0" disabled={!!editingId} checked={formData.isRecurring} onChange={e => setFormData({ ...formData, isRecurring: e.target.checked })} />
                                            <span className={`${ui.textBase} font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-800`}>
                                                {editingId ? 'Série Recorrente Ativa' : 'Repetir Próximos Meses'}
                                            </span>
                                        </label>
                                        {formData.isRecurring && (
                                            <div className="mt-4 p-4 bg-white rounded border border-slate-100">
                                                <label className={`${ui.textBase} font-bold text-slate-400 uppercase block mb-3 text-center tracking-widest`}>Duração: {formData.recurringMonths} meses</label>
                                                <input type="range" min="1" max="48" className="w-full accent-slate-900" value={formData.recurringMonths} onChange={e => setFormData({ ...formData, recurringMonths: parseInt(e.target.value, 10) })} />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => { setIsTransactionModalOpen(false); handleCancelEdit(); }} className={`flex-1 ${ui.btnPad} border border-slate-200 text-slate-400 font-bold uppercase ${ui.textBase} tracking-widest rounded-lg hover:bg-slate-50 transition-all`}>Cancelar</button>
                                    <button type="submit" className={`flex-[2] ${ui.btnPad} bg-slate-900 text-white font-bold uppercase ${ui.textBase} tracking-widest rounded-lg hover:bg-slate-800 transition-all shadow-lg`}>
                                        {editingId ? "Confirmar Atualização" : "Lançar Agora"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className={`grid grid-cols-1 ${ui.colGap}`}>
                <div className="space-y-8">
                    <div className={`flex overflow-x-auto pb-6 ${ui.gap} snap-x no-scrollbar scroll-smooth`}>
                        {nextTwelveMonths.map((mDate, idx) => {
                            const isSel = mDate.getMonth() === currentWorkMonth.getMonth() && mDate.getFullYear() === currentWorkMonth.getFullYear();
                            const days = getDaysInMonth(mDate);
                            return (
                                <div key={idx} onClick={() => setCurrentWorkMonth(new Date(mDate))} className={`min-w-[180px] ${ui.cardPad} ${ui.radius} border cursor-pointer transition-all snap-start ${isSel ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-105' : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'}`}>
                                    <h4 className={`${ui.textBase} font-bold uppercase tracking-[0.2em] text-center mb-6 opacity-80`}>{mDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}</h4>
                                    <div className="grid grid-cols-7 gap-1.5">
                                        {days.map((day, dIdx) => {
                                            const dStr = day ? day.toISOString().split('T')[0] : null;
                                            const dayTrans = transactions.filter(t => t.date === dStr);
                                            return (
                                                <div key={dIdx} className="aspect-square flex flex-col items-center justify-center">
                                                    {day && (
                                                        <Fragment>
                                                            <span className={`${ui.textBase} font-medium opacity-50`}>{day.getDate()}</span>
                                                            <div className="flex gap-1 mt-1">
                                                                {dayTrans.some(t => t.type === 'income') && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                                                {dayTrans.some(t => t.type === 'expense' && !t.isPaid) && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                                                                {dayTrans.some(t => t.type === 'expense' && t.isPaid) && <div className={`w-1.5 h-1.5 rounded-full ${isSel ? 'bg-white/20' : 'bg-slate-200'}`} />}
                                                            </div>
                                                        </Fragment>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className={`bg-white ${ui.radius} border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[850px]`}>
                        <div className={`p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-white sticky top-0 z-20 ${ui.gap}`}>
                            <div className="flex items-center gap-6">
                                <h3 className={`${ui.textBase} font-bold uppercase tracking-[0.3em] text-slate-900`}>Extrato Consolidado</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => exportData('csv', 'month')} className={`p-2 text-slate-400 hover:text-slate-900 border border-slate-100 rounded transition-all`} title="Exportar Mês">
                                        <Icon name="download" className={ui.iconLg} />
                                    </button>
                                </div>
                            </div>
                            <div className="relative w-full sm:w-80">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"><Icon name="search" className={ui.iconLg} /></div>
                                <input type="text" placeholder="Filtrar..." className={`bg-slate-50 pl-12 pr-6 ${ui.inputPad} rounded ${ui.textBase} font-bold w-full outline-none focus:bg-white border-none shadow-inner`} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                            {Object.keys(groupedList).length === 0 ? (
                                <div className={`p-32 text-center text-slate-200 font-bold uppercase ${ui.textBase} tracking-[0.4em] italic opacity-40`}>Nenhum registro</div>
                            ) : (
                                Object.keys(groupedList).map(groupName => (
                                    <div key={groupName} className="border-b border-slate-100">
                                        <div className={`bg-slate-50 p-4 px-8 flex justify-between items-center sticky top-0 z-10`}>
                                            <span className={`${ui.textBase} font-black uppercase tracking-widest text-slate-500 flex items-center gap-2`}>
                                                <Icon name="layer" className={ui.icon} /> {groupName}
                                            </span>
                                            <span className={`${ui.textBase} font-bold ${groupedList[groupName].total >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                                                {formatBRL(groupedList[groupName].total)}
                                            </span>
                                        </div>
                                        <table className="w-full text-left border-collapse">
                                            <tbody className="divide-y divide-slate-100">
                                                {groupedList[groupName].items.map(t => (
                                                    <tr key={t.id} className={`group hover:bg-slate-50/50 transition-all ${editingId === t.id ? 'bg-amber-50/50' : ''}`}>
                                                        <td className={`p-4 w-24 text-center ${ui.textBase}`}>
                                                            <button onClick={async () => await updateDoc(doc(db, 'artifacts', appId, 'users', profile.username.trim().toLowerCase(), 'transactions', t.id), { isPaid: !t.isPaid })} className={`flex flex-col items-center mx-auto transition-all active:scale-90 ${t.isPaid ? 'text-emerald-600' : 'text-slate-300 hover:text-slate-500'}`}>
                                                                <Icon name={t.isPaid ? "check" : "circle"} className={`${ui.iconLg} shadow-sm`} />
                                                                <span className="text-[7px] font-bold uppercase mt-1 tracking-widest">{t.isPaid ? 'Pago' : 'Aberto'}</span>
                                                            </button>
                                                        </td>
                                                        <td className={`p-4 ${ui.textBase}`}>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`${ui.textLg} font-bold text-slate-900 uppercase tracking-tighter truncate max-w-[200px]`}>{t.description}</div>
                                                                {t.recurringGroupId && <Icon name="repeat" className={`${ui.icon} text-slate-300`} />}
                                                            </div>
                                                            <div className={`${ui.textBase} text-slate-400 font-bold uppercase mt-1 flex items-center gap-2 tracking-widest`}>
                                                                {formatDateDisplay(t.date)}
                                                                {t.recurringGroupId && t.recurringIndex && (
                                                                    <span className="text-[10px] font-black bg-slate-900/5 text-slate-500 px-2 py-0.5 rounded border border-slate-100 flex items-center gap-1">
                                                                        <Icon name="repeat" className="w-2 h-2 opacity-40" />
                                                                        PARCELA {t.recurringIndex}/{t.recurringTotal || '?'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className={`p-4 text-right font-bold ${ui.textXl} ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>{formatBRL(t.amount)}</td>
                                                        <td className="p-4 w-32 text-center">
                                                            <div className="flex justify-center gap-4">
                                                                <button onClick={() => {
                                                                    setEditingId(t.id);
                                                                    setFormData({
                                                                        description: t.description || '',
                                                                        amount: t.amount ? String(t.amount) : '',
                                                                        type: t.type || 'expense',
                                                                        category: t.category || 'GERAL',
                                                                        accountGroup: t.accountGroup || 'GERAL',
                                                                        date: t.date || getTodayString(),
                                                                        isPaid: t.isPaid || false,
                                                                        isRecurring: !!t.recurringGroupId,
                                                                        recurringMonths: t.recurringTotal || 1
                                                                    });
                                                                    setIsTransactionModalOpen(true);
                                                                }} className="p-2 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-100 rounded transition-all"><Icon name="pencil" className={ui.icon} /></button>
                                                                <button onClick={() => handleDeleteClick(t)} className="p-2 text-slate-400 hover:text-red-600 border border-transparent hover:border-red-50 rounded transition-all"><Icon name="trash" className={ui.icon} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
