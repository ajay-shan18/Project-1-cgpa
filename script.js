document.addEventListener("DOMContentLoaded", function () {
    let subjects = [];
    let grades = { "O": 10, "A+": 9, "A": 8, "B+": 7, "B": 6, "C": 5, "RA": 0 };

    function addSubject() {
        const semester = document.getElementById("semester").value;
        const subject = document.getElementById("subject").value;
        const grade = document.getElementById("grade").value;
        const credit = parseFloat(document.getElementById("credit").value);

        if (!semester || !subject || !grade || isNaN(credit)) {
            alert("Please fill all fields!");
            return;
        }

        subjects.push({ semester, subject, grade, credit });
        displaySubjects();
    }

    function displaySubjects() {
        const semesterTables = document.getElementById("semesterTables");
        semesterTables.innerHTML = "";

        let groupedBySemester = {};
        subjects.forEach((s, index) => {
            if (!groupedBySemester[s.semester]) groupedBySemester[s.semester] = [];
            groupedBySemester[s.semester].push({ index: index + 1, ...s });
        });

        Object.keys(groupedBySemester).forEach(sem => {
            let tableHtml = `
                <h3>Semester ${sem}</h3>
                <table>
                    <thead>
                        <tr>
                            <th>S.NO</th>
                            <th>Subject</th>
                            <th>Grade</th>
                            <th>Credit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            groupedBySemester[sem].forEach(({ index, subject, grade, credit }) => {
                tableHtml += `
                    <tr>
                        <td>${index}</td>
                        <td>${subject}</td>
                        <td>${grade}</td>
                        <td>${credit.toFixed(1)}</td>
                        <td><button class="delete-btn" onclick="deleteSubject(${index - 1})">Delete</button></td>
                    </tr>
                `;
            });

            tableHtml += `</tbody></table>`;
            semesterTables.innerHTML += tableHtml;
        });
    }

    function calculateCGPA() {
        let totalPoints = 0, totalCredits = 0;
        subjects.forEach(({ grade, credit }) => {
            totalPoints += grades[grade] * credit;
            totalCredits += credit;
        });

        document.getElementById("cgpa").textContent = totalCredits ? (totalPoints / totalCredits).toFixed(4) : "0.0000";
    }

    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Student CGPA Report", 10, 10);
        doc.autoTable({ html: "#semesterTables table" });
        doc.save("CGPA_Report.pdf");
    }

    document.getElementById("addSubject").addEventListener("click", addSubject);
    document.getElementById("calculateCGPA").addEventListener("click", calculateCGPA);
    document.getElementById("downloadPDF").addEventListener("click", generatePDF);
});
