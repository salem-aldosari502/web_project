
function ContactUs(){
    return(<>
      <div className="background-layer"></div>
  
        <section className="contact">
          <div className="contact-card">
            <h2>Contact Us</h2>
            <p>You can send us a message:</p>

            <form className="contact-form">
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
              <textarea placeholder="Write your message..."></textarea>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </section>
    </>);
 }

export default ContactUs;