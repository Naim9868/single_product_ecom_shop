// app/api/orders/route.js
import { storage } from '../../../lib/storage';
import { NextResponse } from 'next/server';

// Store active connections for real-time notifications
let clients = [];

export async function GET(request) {
  const headers = request.headers.get('accept');
  
  if (headers === 'text/event-stream') {
    // SSE for real-time notifications
    const encoder = new TextEncoder();
    
    const customStream = new ReadableStream({
      start(controller) {
        const clientId = Date.now();
        const newClient = {
          id: clientId,
          controller
        };
        clients.push(newClient);

        // Send initial connection message
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'CONNECTED' })}\n\n`));

        // Remove client when connection closes
        request.signal.addEventListener('abort', () => {
          clients = clients.filter(client => client.id !== clientId);
        });
      }
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } else {
    // Regular GET request
    try {
      const orders = storage.read('orders');
      return Response.json(orders);
    } catch (error) {
      return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
  }
}

export async function POST(request) {
  try {
    const newOrder = await request.json();
    const orderWithMetadata = {
      ...newOrder,
      status: 'pending',
      orderId: `TSHIRT-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const success = storage.add('orders', orderWithMetadata);
    
    if (success) {
      // Notify all connected clients about new order
      clients.forEach(client => {
        client.controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({
              type: 'NEW_ORDER',
              order: orderWithMetadata
            })}\n\n`
          )
        );
      });

      return Response.json({ 
        success: true, 
        message: 'Order placed successfully!',
        orderId: orderWithMetadata.orderId
      });
    } else {
      return Response.json({ 
        success: false, 
        message: 'Failed to place order' 
      }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...updates } = await request.json();
    const updateSuccess = storage.update('orders', id, updates);
    
    if (updateSuccess) {
      return Response.json({ success: true, message: 'Order updated successfully' });
    } else {
      return Response.json({ success: false, message: 'Failed to update order' }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: 'Failed to update order' }, { status: 500 });
  }
}