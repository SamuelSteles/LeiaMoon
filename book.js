javascript:(function(){
  const config={readingTime:40,completionPercentage:100};

  function setupUI(){
    const style=document.createElement('style');
    style.textContent=`
      .automation-actions {
        margin-top: 10px;
        display: flex;
        gap: 10px;
      }
      .auto-read-btn, .answer-questions-btn {
        padding: 5px 10px;
        background: #4285f4;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .answer-questions-btn {
        background: #34a853;
      }`;
    document.head.appendChild(style);
  }

  function autoLogin(){
    const token=prompt('🔑 Cole aqui seu token de acesso da Árvore:');
    if(!token)return;
    document.cookie=`access_token=${token}; domain=.arvore.com.br; path=/`;
    window.location.href='https://livros.arvore.com.br/app/books';
  }

  function setupBookOptions(){
    const books=document.querySelectorAll('.book-item');
    books.forEach(book=>{
      const bookId=book.dataset.id||Math.random().toString(36).substr(2,9);
      book.innerHTML+=`
        <div class="automation-actions">
          <button class="auto-read-btn" data-id="${bookId}">📖 Ler Automaticamente</button>
          <button class="answer-questions-btn" data-id="${bookId}">📝 Responder Questões</button>
        </div>`;
    });

    document.addEventListener('click',e=>{
      if(e.target.classList.contains('auto-read-btn')){
        startAutoReading(e.target.dataset.id);
      }else if(e.target.classList.contains('answer-questions-btn')){
        answerBookQuestions(e.target.dataset.id);
      }
    });
  }

  function startAutoReading(bookId){
    console.log(`📚 Simulando leitura do livro ${bookId}...`);
    setTimeout(()=>{
      alert(`✅ Livro marcado como 100% lido em ${config.readingTime} minutos!`);
    },2000);
  }

  function answerBookQuestions(bookId){
    alert(`✅ Questões do livro ${bookId} simuladas! (Recurso em desenvolvimento)`);
  }

  function answerQuestions(){
    const questions=document.querySelectorAll('.question-item');
    questions.forEach((q,i)=>{
      setTimeout(()=>{
        const firstOption=q.querySelector('input[type="radio"]');
        if(firstOption)firstOption.checked=true;
        q.style.backgroundColor='#e8f5e9';
      },i*1000);
    });
    setTimeout(()=>{
      const submitBtn=document.querySelector('.submit-questions');
      if(submitBtn)submitBtn.click();
    },questions.length*1000+2000);
  }

  function isArvorePage(){
    return window.location.href.includes('livros.arvore.com.br');
  }

  function isLoginPage(){
    return window.location.href.includes('/auth');
  }

  function isBooksPage(){
    return window.location.href.includes('/books');
  }

  function isReadingPage(){
    return window.location.href.includes('/reader');
  }

  function isQuestionsPage(){
    return window.location.href.includes('/questions');
  }

  function initAutomation(){
    if(isArvorePage()){
      setupUI();
      if(isLoginPage()) autoLogin();
      else if(isBooksPage()) setupBookOptions();
      else if(isReadingPage()) startAutoReading("default");
      else if(isQuestionsPage()) answerQuestions();
    }
  }

  document.addEventListener('DOMContentLoaded',initAutomation);
})();
