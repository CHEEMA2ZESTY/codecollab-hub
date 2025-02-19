const Contact = () => {
    return (
      <div>
        <h1>Contact Us</h1>
        <p>If you have any questions, feel free to reach out to us!</p>
        <form>
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea placeholder="Your Message"></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
  
  export default Contact;
  