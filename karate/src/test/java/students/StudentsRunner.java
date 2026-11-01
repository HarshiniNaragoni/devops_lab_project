package students;

import com.intuit.karate.junit5.Karate;

class StudentsRunner {

    @Karate.Test
    Karate testStudents() {
        return Karate.run("students").relativeTo(getClass());
    }
}