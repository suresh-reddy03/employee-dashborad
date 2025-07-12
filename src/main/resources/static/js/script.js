let employees = [
    { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', department: 'HR', role: 'Manager' },
    { id: 2, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com', department: 'IT', role: 'Developer' },
    { id: 3, firstName: 'Charlie', lastName: 'Lee', email: 'charlie@example.com', department: 'Finance', role: 'Analyst' }
];

let editingId = null;

function toggleFilterSidebar() {
    const sidebar = document.getElementById('filterSidebar');
    sidebar.classList.toggle('visible');
}

function renderEmployees() {
    const list = document.getElementById('employeeList');
    const sortBy = document.getElementById('sortBy').value;
    const perPage = parseInt(document.getElementById('itemsPerPage').value);
    const first = document.getElementById('filterFirst').value.toLowerCase();
    const dept = document.getElementById('filterDept').value.toLowerCase();
    const role = document.getElementById('filterRole').value.toLowerCase();
    const search = document.getElementById('search').value.toLowerCase();

    let filtered = employees.filter(emp =>
        (emp.firstName + emp.lastName).toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search)
    ).filter(emp =>
        (!first || emp.firstName.toLowerCase().includes(first)) &&
        (!dept || emp.department.toLowerCase().includes(dept)) &&
        (!role || emp.role.toLowerCase().includes(role))
    );

    if (sortBy) {
        filtered.sort((a, b) => a[sortBy].localeCompare(b[sortBy]));
    }

    if (filtered.length === 0) {
        list.innerHTML = '<div class="no-results">No results found.</div>';
        return;
    }

    list.innerHTML = filtered.slice(0, perPage).map(emp => `
        <div class="employee-card">
            <strong>${emp.firstName} ${emp.lastName}</strong>
            <p><strong>Email:</strong> ${emp.email}</p>
            <p><strong>Department:</strong> ${emp.department}</p>
            <p><strong>Role:</strong> ${emp.role}</p>
            <button onclick="editEmployee(${emp.id})">Edit</button>
            <button onclick="deleteEmployee(${emp.id})">Delete</button>
        </div>
    `).join('');
}

function openForm() {
    editingId = null;
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('employeeModal').style.display = 'block';
    document.getElementById('formTitle').innerText = 'Add Employee';
    document.getElementById('saveBtn').innerText = 'Add';

    // Clear form fields
    document.getElementById('empId').value = '';
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('department').value = '';
    document.getElementById('role').value = '';

    // Clear filters & search to show full list after adding
    resetFilters();
}

function closeForm() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('employeeModal').style.display = 'none';
}

function saveEmployee() {
    const newEmp = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        department: document.getElementById('department').value.trim(),
        role: document.getElementById('role').value.trim(),
    };

    if (!newEmp.firstName || !newEmp.lastName || !newEmp.email || !newEmp.department || !newEmp.role) {
        alert('All fields are required');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmp.email)) {
        alert('Invalid email format');
        return;
    }

    if (editingId !== null) {
        // Update existing
        employees = employees.map(emp =>
            emp.id === editingId ? { ...emp, ...newEmp, id: editingId } : emp
        );
    } else {
        // Add new
        const newId = Date.now();
        employees.push({ ...newEmp, id: newId });
    }

    editingId = null;
    closeForm();

    // Reset filters and search before rendering full list
    resetFilters();
}

function editEmployee(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    editingId = id;
    document.getElementById('formTitle').innerText = 'Edit Employee';
    document.getElementById('saveBtn').innerText = 'Update';
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('employeeModal').style.display = 'block';
    document.getElementById('firstName').value = emp.firstName;
    document.getElementById('lastName').value = emp.lastName;
    document.getElementById('email').value = emp.email;
    document.getElementById('department').value = emp.department;
    document.getElementById('role').value = emp.role;
}

function deleteEmployee(id) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    employees = employees.filter(e => e.id !== id);
    renderEmployees();
}

function resetFilters() {
    document.getElementById('filterFirst').value = '';
    document.getElementById('filterDept').value = '';
    document.getElementById('filterRole').value = '';
    document.getElementById('search').value = '';
    document.getElementById('sortBy').value = '';
    renderEmployees();
}

window.onload = () => {
    renderEmployees();

    // Add close button functionality to sidebar
    const closeBtn = document.querySelector('.close-sidebar-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('filterSidebar').classList.remove('visible');
        });
    }
};
