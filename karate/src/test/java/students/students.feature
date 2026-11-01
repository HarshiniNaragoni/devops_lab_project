Feature: Campus Records Hub - Student API

  Background:
    * url baseUrl
    * def newStudent = { name: 'Hasini Reddy', email: 'hasini@example.com', course: 'Computer Science', year: 2 }

  Scenario: Health check returns UP
    Given path 'health'
    When method get
    Then status 200
    And match response.status == 'UP'

  Scenario: Create a student with a year
    Given path 'api', 'students'
    And request newStudent
    When method post
    Then status 201
    And match response contains { name: 'Hasini Reddy', course: 'Computer Science', year: 2 }
    And match response.id == '#number'

  Scenario: Reject a student with missing fields
    Given path 'api', 'students'
    And request { name: 'No Email' }
    When method post
    Then status 400
    And match response.error contains 'required'

  Scenario: Reject a student with an invalid year
    Given path 'api', 'students'
    And request { name: 'Bad Year', email: 'bad@example.com', course: 'Maths', year: 9 }
    When method post
    Then status 400
    And match response.error contains 'year'

  Scenario: Update a student's year
    Given path 'api', 'students'
    And request newStudent
    When method post
    Then status 201
    * def id = response.id

    Given path 'api', 'students', id
    And request { name: 'Hasini Reddy', email: 'hasini@example.com', course: 'Computer Science', year: 3 }
    When method put
    Then status 200
    And match response.year == 3

  Scenario: Delete a student and confirm it is gone
    Given path 'api', 'students'
    And request newStudent
    When method post
    Then status 201
    * def id = response.id

    Given path 'api', 'students', id
    When method delete
    Then status 204

    Given path 'api', 'students', id
    When method get
    Then status 404