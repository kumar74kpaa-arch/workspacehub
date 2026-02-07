export default function BanyanLocationMap() {
  return (
    <div className="w-full h-[300px] md:h-[380px] rounded-lg overflow-hidden border">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.955546153023!2d77.2439248762018!3d28.57110197570414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce3b3aaaaaaab%3A0x88ea287c673132f!2sThe%20Banyan%20-%20Coworking%20space!5e0!3m2!1sen!2sin!4v1770295825316!5m2!1sen!2sin"
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
