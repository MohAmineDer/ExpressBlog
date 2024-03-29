const accountSettingsForm = document.querySelector('.accountSettingsForm');

const usernameErr = document.querySelector('.username');
const emailErr = document.querySelector('.email');

accountSettingsForm.addEventListener('submit', async e => {
    e.preventDefault();

    usernameErr.textContent = '';
    emailErr.textContent = '';

    const formData = new FormData();
    formData.append('username', accountSettingsForm.username.value);
    formData.append('email', accountSettingsForm.email.value);
    formData.append('photo', accountSettingsForm.photo.files[0]);

    try {
        const res = await fetch('/account', {
            method: 'post',
            body: formData
        });

        const data = await res.json();
        if (data.errors) {
            usernameErr.textContent = data.errors.username;
            emailErr.textContent = data.errors.email;
        }
        if (data.user) location.assign('/account');
    } catch (err) {
        console.log(err);
    }

});


const passwordSettingsForm = document.querySelector('.passwordSettingsForm');

const currentPasswordErr = document.querySelector('.currentPassword');
const passwordErr = document.querySelector('.password');
const confirmPasswordErr = document.querySelector('.confirmPassword');

passwordSettingsForm.addEventListener('submit', async e => {
    e.preventDefault();

    currentPasswordErr.textContent = '';
    passwordErr.textContent = '';
    confirmPasswordErr.textContent = '';

    const currentPassword = passwordSettingsForm.currentPassword.value;
    const password = passwordSettingsForm.password.value;
    const confirmPassword = passwordSettingsForm.confirmPassword.value;

    try {
        const res = await fetch('/account-passwordUpdate', {
            method: 'post',
            body: JSON.stringify({currentPassword, password, confirmPassword}),
            headers: {'Content-Type': 'application/json'}
        });

        const data = await res.json();
        if (data.errors) {
            if (data.errors.password === 'incorrect password') currentPasswordErr.textContent = data.errors.password;
            if (data.errors.password !== 'incorrect password') passwordErr.textContent = data.errors.password;
            confirmPasswordErr.textContent = data.errors.confirmPassword;
        }

        if (data.user) location.assign('/account');
    } catch (err) {
        console.log(err);
    }
});

const deleteBtn = document.querySelector('.button-delete');

deleteBtn.addEventListener('click', async () => {
    try {
        const res = await fetch('/account', {method: 'DELETE'});
        location.assign('/blogs');
    } catch (err) {
        console.log(err);
    }
});

const donate = document.querySelector('.donate');
const stripe = Stripe('pk_test_51J2YoQJDNyAkL5CQKkj4Gx45LGcufFqGtQEhs75aVmor1DDQXs5GwOGL9UPBwbMQlqlZjbWldlEk0bckhBI9x6g300XAwdIFP4');

donate.addEventListener('click', async e => {
    e.target.classList.remove('fas', 'fa-donate');
    e.target.textContent = 'Processing...';
    try {
        const res = await fetch('/donate');
        const data = await res.json();
        console.log(data);
        stripe.redirectToCheckout({sessionId: data.session.id});
    } catch (err) {
        console.log(err);
    }
});