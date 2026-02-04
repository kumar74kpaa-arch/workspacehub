export default function MiglanisLocationMap() {
  return (
    <div className="w-full h-[300px] md:h-[380px] rounded-lg overflow-hidden border">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d198263.92072966098!2d76.98826639284793!3d28.500796409631043!2m3!1f0!2f3!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce24db49350f1%3A0x954fda3635e87a4e!2sMiglanis%20%26%20Associates%20Private%20Limited!5e0!3m2!1sen!2sin!4v1770226626187!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="border-0"
      />
    </div>
  );
}
