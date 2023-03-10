namespace webstep.GraphQL.Entities
{
    using HotChocolate;
    using HotChocolate.Types;
    using System.ComponentModel.DataAnnotations;
    using global::NodaTime;
    using webstep.Models;

    public class CustomerType : ObjectType<Customer>
    {
        protected override void Configure(IObjectTypeDescriptor<Customer> descriptor)
        {
        }
    }

    public record AddCustomerInput
    {
        [Required] public string FirstName { get; set; }
        [Required] public string LastName { get; set; }
        [Required] public string Adresse { get; set; }
        [Required] public string Email { get; set; }
        [Required] public string Tlf { get; set; }
    }
#nullable enable
    public record EditCustomerInput(int Id, string? FirstName, string? LastName,string? Adresse, string? Email,string? Tlf);
    public record DeleteCustomerInput(int Id);
    public record CustomerPayload(Customer Customer);
}