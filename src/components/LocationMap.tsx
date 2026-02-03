export default function LocationMap() {
  return (
    <div className="w-full h-[300px] md:h-[380px] rounded-lg overflow-hidden border">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.2100632314828!2d77.23507307409116!3d28.563454187216863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce24b1555553f%3A0x23fd1fc914616587!2sDevelopment%20Solutions!5e0!3m2!1sen!2sin!4v1770136888394!5m2!1sen!2sin"
        width="100%"
        height="100%"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="border-0"
      />
    </div>
  );
}
