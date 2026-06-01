"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "@/assets/logo.png";
import { calculateOrderSummary, fetchOrders, createOrder, updateOrder, deleteOrder } from "@/application/orders";
import { orderStatuses, services } from "@/domain/laundryCatalog";
import { saveOrders } from "@/infrastructure/orderStorage";
import { endOwnerSession } from "@/infrastructure/sessionStorage";
import styles from "./Dashboard.module.css";

const blankForm = {
  customer: "",
  phone: "",
  service: "Wash and Fold",
  items: "1",
  amount: "100",
  due: new Date().toISOString().slice(0, 16), // datetime-local value
  tower: "",
  flat: "",
};

export function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const serverOrders = await fetchOrders();
        // normalize server shape to UI shape
        const mapped = serverOrders.map((o) => ({
          id: o._id || o.id,
          customer: o.customer,
          phone: o.phone,
          service: o.service,
          items: o.quantity || o.items || 1,
          amount: o.amount || 0,
          due: o.due ? new Date(o.due).toLocaleString() : String(o.due || ""),
          status: o.status || "Pending",
        }));
        setOrders(mapped);
      } catch (err) {
        // keep empty list on error
        setOrders([]);
      }
    }

    load();
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const summary = useMemo(() => calculateOrderSummary(orders), [orders]);

  const visibleOrders = orders.filter((order) => {
    const matchesStatus = filter === "All" || order.status === filter;
    const term = query.toLowerCase();
    const matchesQuery =
      order.customer.toLowerCase().includes(term) ||
      order.phone.toLowerCase().includes(term) ||
      order.id.toLowerCase().includes(term);
    return matchesStatus && matchesQuery;
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData);
    try {
      const created = await createOrder(values);
      console.log(created);
      
      const mapped = {
        id: created._id || created.id,
        customer: created.customer,
        phone: created.phone,
        service: created.service,
        items: created.quantity || created.items || 1,
        amount: created.amount || 0,
        due: created.due ? new Date(created.due).toLocaleString() : String(created.due || ""),
        status: created.status || "Pending",
      };
      setOrders((currentOrders) => [mapped, ...currentOrders]);
      event.target.reset();
    } catch (err) {
      // TODO: show error UI
      console.error(err);
    }
  }

  async function updateStatus(orderId, status) {
    try {
      await updateOrder(orderId, status);
      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.id === orderId ? { ...order, status } : order)),
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function removeOrder(orderId) {
    try {
      await deleteOrder(orderId);
      setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error(err);
    }
  }

  function logout() {
    endOwnerSession();
    router.replace("/login");
  }

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Image src={logo} alt="Ganesh Power Laundary logo" width={52} height={52} priority />
          <div>
            <span>Owner console</span>
            <strong>Ganesh Power Laundary</strong>
          </div>
        </div>
        <nav className={styles.sideNav} aria-label="Dashboard sections">
          <a href="#orders">Orders</a>
          <a href="#add">Add Customer</a>
          <a href="#flow">Status Flow</a>
        </nav>
        <button className={styles.logout} onClick={logout} type="button">
          Logout
        </button>
      </aside>

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <div>
            <p>Management</p>
            <h1>Dashboard</h1>
          </div>
          <div className={styles.searchPill}>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search orders"
              aria-label="Search orders"
            />
          </div>
        </header>

        <section className={styles.stats} aria-label="Order summary">
          <article>
            <span>Total Orders</span>
            <strong>{summary.total}</strong>
            <p>Current records</p>
          </article>
          <article>
            <span>Pending Work</span>
            <strong>{summary.pending}</strong>
            <p>Pending and in process</p>
          </article>
          <article>
            <span>Completed</span>
            <strong>{summary.completed}</strong>
            <p>Ready or delivered</p>
          </article>
          <article>
            <span>Revenue</span>
            <strong>Rs. {summary.revenue.toLocaleString("en-IN")}</strong>
            <p>Frontend estimate</p>
          </article>
        </section>

        <section className={styles.grid}>
          <form id="add" className={styles.formPanel} onSubmit={handleSubmit}>
            <div className={styles.panelHeader}>
              <p>Add Customer</p>
              <h2>New Order</h2>
            </div>
            <label>
              Customer Name
              <input name="customer" required />
            </label>
            {/* <label>
              Phone
              <input name="phone" required />
            </label> */}
            <label>
              Service
              <select name="service" defaultValue={blankForm.service}>
                {services.map((service) => (
                  <option key={service.title}>{service.title}</option>
                ))}
              </select>
            </label>
            <div className={styles.formSplit}>
              <label>
                Items
                <input name="items" type="number" min="1" defaultValue={blankForm.items} required />
              </label>
              <label>
                Amount
                <input name="amount" type="number" min="0" defaultValue={blankForm.amount} required />
              </label>
            </div>
            <label>
              Due Time
              <input name="due" type="datetime-local" defaultValue={blankForm.due} required />
            </label>
            <div className={styles.formSplit}>
              <label>
                Tower
                <input name="tower" placeholder="Tower" />
              </label>
              <label>
                Flat
                <input name="flat" placeholder="Flat" />
              </label>
            </div>
            <button type="submit">Add Order</button>
          </form>

          <section id="orders" className={styles.ordersPanel}>
            <div className={styles.panelHeader}>
              <p>Live Queue</p>
              <h2>Customer Orders</h2>
            </div>
            <div className={styles.filters}>
              {["All", ...orderStatuses].map((status) => (
                <button
                  key={status}
                  className={filter === status ? styles.activeFilter : ""}
                  onClick={() => setFilter(status)}
                  type="button"
                >
                  {status}
                </button>
              ))}
            </div>

            <div className={styles.orderList}>
              {visibleOrders.map((order) => (
                <article className={styles.orderCard} key={order.id}>
                  <div className={styles.orderTop}>
                    <div>
                      <span>{order.id}</span>
                      <h3>{order.customer}</h3>
                      <p>{order.phone}</p>
                    </div>
                    <strong className={order.status === "Completed" ? styles.done : styles.pending}>
                      {order.status}
                    </strong>
                  </div>
                  <div className={styles.orderMeta}>
                    <span>{order.service}</span>
                    <span>{order.items} items</span>
                    <span>Rs. {Number(order.amount).toLocaleString("en-IN")}</span>
                    <span>{order.due}</span>
                  </div>
                  <div className={styles.orderActions}>
                    {orderStatuses.map((status) => (
                      <button
                        key={status}
                        className={order.status === status ? styles.selectedStatus : ""}
                        onClick={() => updateStatus(order.id, status)}
                        type="button"
                      >
                        {status}
                      </button>
                    ))}
                    <button className={styles.removeButton} onClick={() => removeOrder(order.id)} type="button">
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section id="flow" className={styles.flow}>
          <h2>Status Flow</h2>
          <div>
            <span>Pending</span>
            <span>In Process</span>
            <span>Completed</span>
          </div>
        </section>
      </section>
    </main>
  );
}
