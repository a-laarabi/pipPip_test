# pipPip test

In this project, I have developed a Secure Authentication System using Node.js and Express. This system allows users to register, log in, and reset their passwords in case they forget them. I have focused on implementing various security measures to enhance the overall security of the application.

To protect sensitive routes that require user authentication, such as the dashboard and home pages, I have integrated middleware functions. These middleware functions ensure that only authenticated users can access these areas.

I have also paid careful attention to maintaining a clean and organized code structure to improve the overall readability and maintainability of the project.

I hope you find this project valuable, and if you have any suggestions or modifications in mind, please don't hesitate to reach out to me. I am more than willing to make any necessary improvements to enhance the project further. Your feedback is greatly appreciated.


## Built With

- Node.js
- Expres



## Getting Started

To successfully utilize this project
- First of all, you need to clone or download the repository.
```
git clone https://github.com/a-laarabi/pipPip_test.git
```
- Then run
  ```
  npm i
  ```
- Create the 'pipPip' database.
- Update the user and password in the db.js file.
- Create a .env file and add these two variables to it:
```
NODEMAILER_USER = email to send the token to reset the password
NODEMAILER_PASS = password
```
- Then, run this command:
```
npm start
```
The application will start on port 3000.


## prerequisites:
. Code editor
. Node.js
. MySQL


## Author

👤 **Anasse LAARABI**

- GitHub: [@a-laarabi](https://github.com/a-laarabi)
- LinkedIn: [a-laarabi](https://www.linkedin.com/in/a-laarabi/)