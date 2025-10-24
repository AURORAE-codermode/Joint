document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('registerForm');
  const username = form.elements['username'];
  const email = form.elements['email'];
  const password = form.elements['password'];
  const confirmPassword = form.elements['confirmPassword'];

  function setError(el, msg){
    const small = el.parentElement.querySelector('.error');
    small.textContent = msg || '';
    if(msg){ el.setAttribute('aria-invalid','true'); } else { el.removeAttribute('aria-invalid'); }
  }

  function validate(){
    let ok = true;
    // username
    if(!username.value.trim()){ setError(username, '请输入用户名'); ok = false; }
    else if(username.value.trim().length < 3){ setError(username, '用户名至少 3 个字符'); ok = false; }
    else setError(username, '');

    // email
    if(!email.value.trim()){ setError(email, '请输入邮箱'); ok = false; }
    else if(!/^\S+@\S+\.\S+$/.test(email.value)){ setError(email, '邮箱格式不正确'); ok = false; }
    else setError(email, '');

    // password
    if(!password.value){ setError(password, '请输入密码'); ok = false; }
    else if(password.value.length < 6){ setError(password, '密码至少 6 位'); ok = false; }
    else setError(password, '');

    // confirm
    if(confirmPassword.value !== password.value){ setError(confirmPassword, '两次密码不一致'); ok = false; }
    else setError(confirmPassword, '');

    return ok;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(validate()){
      // 模拟提交
      alert('注册成功！(此处为演示，未实际向服务器发送数据)');
      form.reset();
    }
  });

  // 实时校验：失去焦点时验证当前字段
  [username,email,password,confirmPassword].forEach(el=>{
    el.addEventListener('blur', validate);
  });
});
