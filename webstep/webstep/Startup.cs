using webstep.GraphQL.Mutations;

namespace webstep
{
    using System;
    using System.Reflection;
    using System.Text;

    using EntityFrameworkCore.SqlServer.NodaTime.Extensions;

    using global::GraphQL.Server.Ui.Voyager;

    using HotChocolate;
    using HotChocolate.AspNetCore;
    using HotChocolate.AspNetCore.Playground;
    using HotChocolate.Execution.Configuration;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.IdentityModel.Tokens;

    using Newtonsoft.Json;

    using webstep.Data;
    using webstep.GraphQL;
    using webstep.GraphQL.Entities;
    using webstep.GraphQL.NodaTime.Extensions;
    using webstep.Interfaces;
    using webstep.Models;

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services">
        /// The services.
        /// </param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddAntiforgery(options =>
            {
                options.HeaderName = "X-XSRF-TOKEN";
            });

            ConfigureDatabase(services);           
            
            services
                .AddGraphQLServer()
                .AddQueryType<Query>()
                .AddMutationType<Mutation>()
                .AddSubscriptionType<Subscription>()
                .AddProjections()
                .AddFiltering()
                .AddSorting()
                .AddErrorFilter<GraphQlErrorFilter>()
                .AddInMemorySubscriptions()
                .AddMaxComplexityRule(65)
                .AddMaxExecutionDepthRule(65)
                .ConfigureSchema(x => x.AddNodaTime());
                
            AddTypes(services);

            ////development only
            services.AddDatabaseDeveloperPageExceptionFilter();
            //// In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = "JwtBearer";
                options.DefaultChallengeScheme = "JwtBearer";
            })
                .AddJwtBearer("JwtBearer", jwtBearerOptions =>
                {
                    jwtBearerOptions.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("$$1212hjiesafihjbdwq")),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.FromMinutes(5)
                    };
                });
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app">
        /// The app.
        /// </param>
        /// <param name="env">
        /// The env.
        /// </param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UsePlayground(new PlaygroundOptions
                {
                    QueryPath = "/graphql",
                    Path = "/playground"
                });
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }
            app.UseWebSockets();

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseGraphQLVoyager(
                new GraphQLVoyagerOptions()
                {
                    GraphQLEndPoint = "/graphql",
                    Path = "/graphql-voyager"
                });

            app.UseRouting();
            ////app.UseAuthentication();
            ////app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGraphQL();
                ////.RequireAuthorization();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

        /// <summary>
        /// Configures a database connection pool
        /// </summary>
        /// <param name="services">
        /// The services.
        /// </param>
        protected virtual void ConfigureDatabase(IServiceCollection services)
        {
            services.AddTransient<IRepository, Repository>();

            services.AddPooledDbContextFactory<WebstepContext>(
                options => options.UseSqlServer(
                    this.Configuration.GetConnectionString("DefaultConnection"),
                    x => x.UseNodaTime()));
        }
        private void AddTypes(IServiceCollection services)
        {
            services.AddGraphQLServer()
                .AddType<SellerType>()
                .AddType<SellerMutation>()
                .AddType<ProspectType>()
                .AddType<ProspectMutation>()
                .AddType<SubProspectType>()
                .AddType<SubProspectMutation>()
                .AddType<ConsultantType>()
                .AddType<ConsultantMutation>()
                .AddType<ContractType>()
                .AddType<ContractMutation>()
                .AddType<VacancyType>()
                .AddType<VacancyMutation>()
                .AddType<FinancialType>()
                .AddType<FinancialMutation>()
                .AddType<WeekYearType>()
                .AddType<ConsultantCapacityType>()
                .AddType<CapacityType>()
                .AddType<ProjectType>()
                .AddType<ProjectMutation>()                
                .AddType<TeamConsultantType>()
                .AddType<TeamConsultantMutation>();
        }
    }
}
